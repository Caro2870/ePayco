# ePayCo - Sistema de Billetera Virtual

Este sistema de billetera virtual consta de dos componentes principales:

1. **Servicio SOAP**: Servicio backend que maneja operaciones de base de datos, sesiones de pago y operaciones de billetera
2. **API REST**: Servicio NestJS que actúa como puente entre los clientes y el servicio SOAP

## URLs de Producción

- **API REST Swagger UI**: [https://epayco-production.up.railway.app/api](https://epayco-production.up.railway.app/api#/wallet/WalletController_checkBalance)
- **Servicio SOAP**: [https://epayco-production-8b7a.up.railway.app/wallet-service?wsdl](https://epayco-production-8b7a.up.railway.app/wallet-service?wsdl)

## Arquitectura del Sistema

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐     ┌─────────┐
│  Clientes   │────▶│  API REST     │────▶│ Servicio SOAP │────▶│ MongoDB │
│ (Frontend)  │◀────│  (NestJS)     │◀────│               │◀────│         │
└─────────────┘     └───────────────┘     └───────────────┘     └─────────┘
                            │                     │                  │
                            ▼                     ▼                  │
                    ┌───────────────┐     ┌───────────────┐         │
                    │  Swagger UI   │     │ Envío de      │         │
                    │ Documentación │     │ emails (token) │◀────────┘
                    └───────────────┘     └───────────────┘
```

## Diagrama de Flujo del Proceso de Pago

```
┌──────────┐     ┌──────────┐     ┌────────────┐     ┌─────────────┐     ┌─────────────┐
│ Inicio   │────▶│ Solicitar│────▶│ Generar    │────▶│ Enviar token │────▶│ Confirmar   │
│ de pago  │     │ pago     │     │ token      │     │ por email    │     │ pago        │
└──────────┘     └──────────┘     └────────────┘     └─────────────┘     └─────────────┘
                                                                                 │
                                        ┌────────────────────┐                   │
                                        │ Actualizar saldo   │◀──────────────────┘
                                        │ y registrar        │
                                        │ transacción        │
                                        └────────────────────┘
```

## Características

- Registro de clientes
- Recarga de billetera
- Iniciación de pagos con verificación basada en tokens
- Confirmación de pagos
- Consulta de saldo
- Notificación por email para confirmaciones de pago
- Historial de transacciones

## Tecnologías Utilizadas

- **Backend**:
  - NestJS (API REST)
  - Node.js
  - TypeScript
  - SOAP (xml-soap)
  - Mongoose/MongoDB

- **Seguridad**:
  - JWT para tokens de autenticación
  - Validación de sesiones con tiempo de expiración
  - Verificación en dos pasos para pagos

- **Despliegue**:
  - Railway para despliegue continuo
  - MongoDB Atlas para base de datos

## Prerrequisitos

- Node.js (v16 o superior)
- MongoDB
- npm o yarn

## Estructura del Proyecto

```
/ (raíz)
├── README.md
├── rest-api/      # Aplicación API REST con NestJS
│   ├── src/
│   │   ├── wallet/
│   │   │   ├── wallet.controller.ts # Controladores de la API
│   │   │   ├── wallet.service.ts    # Servicios que se comunican con SOAP
│   │   │   └── dto/                 # Objetos de transferencia de datos
│   │   └── config/                  # Configuraciones
│   └── ...
└── soap-service/  # Aplicación de servicio SOAP
    ├── src/
    │   ├── models/                  # Modelos de datos (MongoDB)
    │   ├── services/                # Servicios de negocio
    │   ├── utils/                   # Utilidades
    │   └── ...
    └── ...
```

## Instrucciones de Configuración

### 1. Configuración de MongoDB

Asegúrese de que MongoDB esté funcionando en su sistema. La cadena de conexión predeterminada es `mongodb://localhost:27017/wallet_db`.

### 2. Configuración del Servicio SOAP

```bash
cd soap-service

# Instalar dependencias
npm install

# Configurar variables de entorno
# Edite el archivo .env con su conexión a MongoDB, configuración de email, etc.

# Iniciar el servicio SOAP
npm run dev
```

El servicio SOAP se ejecutará en http://localhost:8000/wallet-service por defecto.

### 3. Configuración de la API REST

```bash
cd rest-api

# Instalar dependencias
npm install

# Configurar variables de entorno
# El archivo .env debe tener la URL correcta del servicio SOAP

# Iniciar la API REST
npm run start:dev
```

La API REST se ejecutará en http://localhost:3000 por defecto.
La documentación de la API está disponible en http://localhost:3000/api.

## Endpoints de API

### Registro de Cliente
- **POST** `/api/wallet/register`
- Registra un nuevo cliente en el servicio de billetera

### Recarga de Billetera
- **POST** `/api/wallet/recharge`
- Añade fondos a la billetera de un cliente

### Iniciar Pago
- **POST** `/api/wallet/payment/initiate`
- Inicia un proceso de pago (envía un token de confirmación por email)

### Confirmar Pago
- **POST** `/api/wallet/payment/confirm`
- Completa un pago usando el ID de sesión y el token

### Verificar Saldo
- **POST** `/api/wallet/balance`
- Verifica el saldo actual de la billetera de un cliente y muestra el historial de transacciones recientes

## Ejemplos de Uso

### Registrar un Cliente

```bash
curl -X POST https://epayco-production.up.railway.app/api/wallet/register \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "names": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890"
  }'
```

### Recargar Billetera

```bash
curl -X POST https://epayco-production.up.railway.app/api/wallet/recharge \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "phone": "+1234567890",
    "amount": 100.50
  }'
```

### Iniciar Pago

```bash
curl -X POST https://epayco-production.up.railway.app/api/wallet/payment/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "phone": "+1234567890",
    "amount": 50.25
  }'
```

### Confirmar Pago

```bash
curl -X POST https://epayco-production.up.railway.app/api/wallet/payment/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-id-from-response",
    "token": "token-from-email"
  }'
```

### Verificar Saldo

```bash
curl -X POST https://epayco-production.up.railway.app/api/wallet/balance \
  -H "Content-Type: application/json" \
  -d '{
    "document": "1234567890",
    "phone": "+1234567890"
  }'
```

## Configuración

### Servicio SOAP (.env)

```
# Configuración del servicio SOAP
PORT=8000
HOST=localhost
SERVICE_URL=http://localhost:8000/wallet-service

# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/wallet_db

# Configuración de email 
SENDGRID_API_KEY=your-api-key
EMAIL_FROM=your-email@example.com
EMAIL_FROM_NAME=Virtual Wallet

# Otras configuraciones
NODE_ENV=development
JWT_SECRET=your-secret-key-for-jwt
```

### API REST (.env)

```
PORT=3000
SOAP_SERVICE_URL=http://localhost:8000/wallet-service
```

## Estructura de la Base de Datos

### Colecciones

1. **clients**
   - document (string, único): Documento de identificación del cliente
   - names (string): Nombre completo del cliente
   - email (string, único): Correo electrónico del cliente
   - phone (string): Número de teléfono del cliente
   - balance (number): Saldo actual de la billetera
   - createdAt (Date): Fecha de creación del registro
   - updatedAt (Date): Fecha de actualización del registro

2. **transactions**
   - clientId (ObjectId): Referencia al cliente
   - type (enum): Tipo de transacción (DEPOSIT, PURCHASE)
   - amount (number): Monto de la transacción
   - reference (string): Descripción o referencia
   - status (enum): Estado de la transacción (PENDING, COMPLETED, FAILED)
   - createdAt (Date): Fecha de la transacción
   - updatedAt (Date): Fecha de actualización

## Notas para Producción

- Configuración adecuada de credenciales de email para enviar tokens
- Implementación de medidas de seguridad apropiadas (HTTPS, claves API, etc.)
- Configuración de MongoDB con autenticación
- Configuración de logging y monitoreo
- Implementación de rate limiting para prevenir ataques
- Configuración de backups regulares de la base de datos

## Mejoras Futuras

- Implementación de autenticación OAuth2
- Soporte para múltiples monedas
- Interfaz de usuario para administración
- Integración con proveedores de pago adicionales
- Implementación de notificaciones push
- Reportes y análisis financieros
