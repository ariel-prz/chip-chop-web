-- Chip Chop Pet Shop: pedidos, pagos Deuna y comprobantes
-- Diseño: el navegador nunca lee tablas con datos personales.
-- Todo lo público pasa por funciones SECURITY DEFINER con validación.

create schema if not exists private;

-- Configuración privada (no expuesta por la API)
create table if not exists private.settings (
  key text primary key,
  value text not null
);

-- Personal autorizado para el panel
create table public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);
alter table public.staff enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff s where s.user_id = auth.uid());
$$;

create policy staff_read_self on public.staff
  for select to authenticated using (user_id = auth.uid());

-- Catálogo (precios de referencia para que el servidor calcule el total)
create table public.products (
  sku text primary key,
  name text not null,
  price numeric(10,2) not null check (price > 0),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy products_public_read on public.products
  for select to anon, authenticated using (active);
create policy products_staff_write on public.products
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Pedidos
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  phone text not null check (phone ~ '^[0-9+ ]{7,16}$'),
  id_document text check (id_document is null or id_document ~ '^[0-9]{10}([0-9]{3})?$'),
  delivery_method text not null check (delivery_method in ('retiro','envio')),
  address text,
  zone text check (zone is null or zone in ('norte','centro','sur','valles')),
  notes text check (notes is null or char_length(notes) <= 500),
  items jsonb not null,
  subtotal numeric(10,2) not null,
  amount_due numeric(10,2) not null,
  status text not null default 'pendiente_pago'
    check (status in ('pendiente_pago','pago_validado','en_revision','listo','entregado','cancelado')),
  consent_privacy boolean not null check (consent_privacy),
  receipt_path text,
  receipt_uploaded_at timestamptz,
  paid_at timestamptz,
  validated_by text,
  payment_id uuid
);
create index orders_pending_amount on public.orders (amount_due, created_at)
  where status in ('pendiente_pago','en_revision');
alter table public.orders enable row level security;
create policy orders_staff_read on public.orders
  for select to authenticated using (public.is_staff());
create policy orders_staff_update on public.orders
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

-- Pagos recibidos (notificaciones de Deuna Negocios)
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  received_at timestamptz not null default now(),
  source text not null default 'deuna_notificacion',
  raw_title text,
  raw_text text,
  amount numeric(10,2) not null,
  payer_name text,
  account_last4 text,
  dedupe_key text not null unique,
  matched_order_id uuid references public.orders(id)
);
alter table public.payments enable row level security;
create policy payments_staff_read on public.payments
  for select to authenticated using (public.is_staff());
create policy payments_staff_update on public.payments
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

alter table public.orders
  add constraint orders_payment_fk foreign key (payment_id) references public.payments(id);

-- Crear pedido: el servidor calcula subtotal y monto único con centavos
create or replace function public.create_order(
  p_name text,
  p_phone text,
  p_id_document text,
  p_delivery text,
  p_address text,
  p_zone text,
  p_notes text,
  p_items jsonb,
  p_consent boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_subtotal numeric(10,2) := 0;
  v_items jsonb := '[]'::jsonb;
  v_item jsonb;
  v_prod public.products%rowtype;
  v_qty int;
  v_amount numeric(10,2);
  v_k int;
  v_code text;
  v_id uuid;
begin
  if p_consent is not true then
    raise exception 'Debes aceptar la política de privacidad';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0
     or jsonb_array_length(p_items) > 40 then
    raise exception 'Carrito inválido';
  end if;
  if p_delivery = 'envio' and (coalesce(trim(p_address),'') = '' or p_zone is null) then
    raise exception 'Falta la dirección o el sector de entrega';
  end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_prod from public.products
      where sku = v_item->>'sku' and active;
    if not found then
      raise exception 'Producto no disponible: %', v_item->>'sku';
    end if;
    v_qty := (v_item->>'qty')::int;
    if v_qty is null or v_qty < 1 or v_qty > 50 then
      raise exception 'Cantidad inválida';
    end if;
    v_subtotal := v_subtotal + v_prod.price * v_qty;
    v_items := v_items || jsonb_build_object(
      'sku', v_prod.sku, 'name', v_prod.name, 'price', v_prod.price, 'qty', v_qty);
  end loop;

  -- Bloqueo corto para que dos pedidos simultáneos no reciban el mismo monto
  perform pg_advisory_xact_lock(424242);

  v_amount := null;
  for v_k in 1..99 loop
    -- Se descuentan centavos (el cliente paga un poco menos, nunca más)
    v_amount := case when v_subtotal > 1.50 then v_subtotal - v_k * 0.01
                     else v_subtotal + v_k * 0.01 end;
    exit when not exists (
      select 1 from public.orders o
      where o.amount_due = v_amount
        and o.status in ('pendiente_pago','en_revision')
        and o.created_at > now() - interval '24 hours');
    v_amount := null;
  end loop;
  if v_amount is null then
    raise exception 'Hay demasiados pedidos pendientes, intenta en unos minutos';
  end if;

  loop
    v_code := 'CC-' || upper(substr(md5(gen_random_uuid()::text), 1, 5));
    exit when not exists (select 1 from public.orders where code = v_code);
  end loop;

  insert into public.orders (code, customer_name, phone, id_document, delivery_method,
    address, zone, notes, items, subtotal, amount_due, consent_privacy)
  values (v_code, trim(p_name), regexp_replace(p_phone, '\s', '', 'g'),
    nullif(trim(p_id_document), ''), p_delivery, nullif(trim(p_address), ''), p_zone,
    nullif(trim(p_notes), ''), v_items, v_subtotal, v_amount, true)
  returning id into v_id;

  return jsonb_build_object('id', v_id, 'code', v_code,
    'subtotal', v_subtotal, 'amount_due', v_amount);
end;
$$;

-- Estado público del pedido (solo con el id, que no se puede adivinar)
create or replace function public.get_order_status(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('code', code, 'status', status, 'amount_due', amount_due,
    'subtotal', subtotal, 'delivery_method', delivery_method,
    'has_receipt', receipt_path is not null, 'created_at', created_at)
  from public.orders where id = p_id;
$$;

-- Registrar la captura subida al bucket
create or replace function public.attach_receipt(p_id uuid, p_path text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_path not like p_id::text || '/%' then
    raise exception 'Ruta inválida';
  end if;
  update public.orders
    set receipt_path = p_path, receipt_uploaded_at = now()
    where id = p_id and status in ('pendiente_pago','en_revision');
  return found;
end;
$$;

-- Ingesta de notificaciones Deuna (MacroDroid llama a esta función)
create or replace function public.ingest_deuna_notification(
  p_token text, p_title text, p_text text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_expected text;
  v_full text := coalesce(p_title, '') || ' ' || coalesce(p_text, '');
  v_raw text;
  v_amount numeric(10,2);
  v_payer text;
  v_last4 text;
  v_payment uuid;
  v_order public.orders%rowtype;
  v_key text;
begin
  select value into v_expected from private.settings where key = 'webhook_token';
  if v_expected is null or p_token is distinct from v_expected then
    raise exception 'No autorizado';
  end if;

  -- Solo pagos recibidos, nunca "Pagaste" ni promociones
  if v_full !~* '(recibiste|te pag[oó])' then
    return jsonb_build_object('ok', true, 'ignored', true);
  end if;

  v_raw := (regexp_match(v_full, '\$\s?([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2}|[0-9]+(?:[.,][0-9]{1,2})?)'))[1];
  if v_raw is null then
    return jsonb_build_object('ok', false, 'error', 'monto no encontrado');
  end if;
  if position(',' in v_raw) > 0 then
    v_raw := replace(replace(v_raw, '.', ''), ',', '.');
  end if;
  v_amount := v_raw::numeric;

  v_payer := nullif(trim((regexp_match(coalesce(p_text, ''), '^(.*?),\s*te pag'))[1]), '');
  v_last4 := (regexp_match(coalesce(p_text, ''), '\*+([0-9]{3,4})'))[1];
  v_key := md5(v_full || date_trunc('minute', now())::text);

  insert into public.payments (raw_title, raw_text, amount, payer_name, account_last4, dedupe_key)
  values (p_title, p_text, v_amount, v_payer, v_last4, v_key)
  on conflict (dedupe_key) do nothing
  returning id into v_payment;

  if v_payment is null then
    return jsonb_build_object('ok', true, 'duplicate', true);
  end if;

  select * into v_order from public.orders
    where amount_due = v_amount
      and status in ('pendiente_pago','en_revision')
      and created_at > now() - interval '24 hours'
    order by created_at asc
    limit 1
    for update;

  if found then
    update public.orders
      set status = 'pago_validado', paid_at = now(), payment_id = v_payment,
          validated_by = 'automatico'
      where id = v_order.id;
    update public.payments set matched_order_id = v_order.id where id = v_payment;
    return jsonb_build_object('ok', true, 'matched', v_order.code, 'amount', v_amount);
  end if;

  return jsonb_build_object('ok', true, 'matched', null, 'amount', v_amount);
end;
$$;

-- Permisos de ejecución
revoke all on function public.create_order(text,text,text,text,text,text,text,jsonb,boolean) from public;
revoke all on function public.get_order_status(uuid) from public;
revoke all on function public.attach_receipt(uuid,text) from public;
revoke all on function public.ingest_deuna_notification(text,text,text) from public;
revoke all on function public.is_staff() from public;
grant execute on function public.create_order(text,text,text,text,text,text,text,jsonb,boolean) to anon, authenticated;
grant execute on function public.get_order_status(uuid) to anon, authenticated;
grant execute on function public.attach_receipt(uuid,text) to anon, authenticated;
grant execute on function public.ingest_deuna_notification(text,text,text) to anon, authenticated;
grant execute on function public.is_staff() to authenticated;

-- Bucket privado para capturas de pago (máx. 5 MB, solo imágenes)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('comprobantes', 'comprobantes', false, 5242880,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif'])
on conflict (id) do nothing;

create or replace function public.order_accepts_receipt(p_folder text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.orders
    where id::text = p_folder
      and status in ('pendiente_pago','en_revision')
      and receipt_path is null);
$$;
revoke all on function public.order_accepts_receipt(text) from public;
grant execute on function public.order_accepts_receipt(text) to anon, authenticated;

create policy comprobantes_upload on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'comprobantes'
    and public.order_accepts_receipt((storage.foldername(name))[1]));

create policy comprobantes_staff_read on storage.objects
  for select to authenticated
  using (bucket_id = 'comprobantes' and public.is_staff());
