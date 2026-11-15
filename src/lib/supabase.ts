import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Claves públicas (publishable): pueden ir en el navegador.
// Los datos de clientes están protegidos por RLS y funciones con validación.
const URL = "https://yhyquywkowydbonbphov.supabase.co";
const KEY = "sb_publishable_lDoZ9gdXskPa9Xnqo3BATw_OvTKvq27";

let client: SupabaseClient | null = null;

export function supabase() {
  if (!client) client = createClient(URL, KEY);
  return client;
}
