# Validación automática de pagos Deuna con MacroDroid

El celular del local (Android, con Deuna Negocios) reenvía cada notificación de pago
recibido a la base de datos. La base de datos lee el monto y lo empareja con el pedido
pendiente que tiene ese monto exacto.

Tiempo estimado: 10 minutos.

## 1. Instalar

1. En el celular del local, instala **MacroDroid** desde Google Play (la versión gratis alcanza).
2. Ábrelo y concede el permiso **Acceso a notificaciones** cuando lo pida
   (Ajustes > Notificaciones > Acceso a notificaciones > MacroDroid > Activar).
3. Desactiva la optimización de batería para MacroDroid
   (Ajustes > Batería > MacroDroid > Sin restricciones). Si no, Android lo cierra de noche.

## 2. Crear la macro

Toca **Agregar macro** y nómbrala `Pagos Deuna a Chip Chop`.

### Disparador (Trigger)
- **Notificación > Notificación recibida**
- Aplicación: selecciona **Deuna Negocios** (o la app Deuna que recibe los cobros).
- Contenido del texto: **Contiene** `Recibiste`
- Deja marcado "Ignorar notificaciones en curso".

### Acción (Action)
- **Conectividad > Solicitud HTTP** (HTTP Request)
- Método: **POST**
- URL:
  ```
  https://yhyquywkowydbonbphov.supabase.co/rest/v1/rpc/ingest_deuna_notification
  ```
- Encabezados (Headers), agrega dos:
  - `apikey` = `sb_publishable_lDoZ9gdXskPa9Xnqo3BATw_OvTKvq27`
  - `Content-Type` = `application/json`
- Cuerpo (Body), tipo **Texto / JSON**:
  ```json
  {"p_token":"PEGAR_EL_TOKEN_AQUI","p_title":"[notification_title]","p_text":"[notification]"}
  ```
  `[notification_title]` y `[notification]` se insertan con el botón **...** (variables mágicas)
  de MacroDroid: "Título de la notificación" y "Texto de la notificación".
- El token (`p_token`) te lo paso por separado. **No lo publiques ni lo compartas**:
  con él cualquiera podría registrar pagos falsos.

### Restricciones (opcional)
- Ninguna. Debe funcionar las 24 horas.

Guarda la macro y verifica que esté **activada**.

## 3. Probar

1. En el sitio, haz un pedido de prueba con un producto barato y anota el monto exacto
   (por ejemplo $1.49).
2. Desde otro celular, paga ese monto exacto por Deuna al QR de la tienda.
3. En 5 a 30 segundos la página del pedido debe cambiar sola a **Pago validado**.
4. En MacroDroid > Registro del sistema puedes ver si la solicitud HTTP respondió `200`.

## Qué hace el sistema con cada notificación

| Notificación | Resultado |
|---|---|
| "Recibiste $X" con monto igual a un pedido pendiente | Pedido pasa a **Pago validado** |
| "Recibiste $X" sin pedido con ese monto | Queda en **Pagos Deuna sin pedido** en el panel, para revisar a mano |
| "Pagaste...", promociones u otras | Se ignoran |
| La misma notificación dos veces en el mismo minuto | Se registra una sola vez |

## Si algo falla

- **No llega nada:** revisa que MacroDroid tenga acceso a notificaciones y sin restricción de batería.
- **Respuesta 400 "No autorizado":** el token está mal copiado.
- **El pago llega pero no valida:** el cliente pagó otro monto. Valídalo a mano desde
  `https://chipchoppetshop.com/panel/` comparando con la captura.
