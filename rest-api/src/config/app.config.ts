export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  soapService: {
    // Usar la URL que Railway asigna al servicio SOAP
    // En Railway, puedes usar ${process.env.RAILWAY_SERVICE_SOAP_URL} para referirte a otro servicio
    url: process.env.SOAP_SERVICE_URL || process.env.RAILWAY_SERVICE_SOAP_URL || 'http://localhost:8000/wallet-service?wsdl',
  },
  swagger: {
    title: 'Virtual Wallet API',
    description: 'REST API for Virtual Wallet Service',
    version: '1.0',
  },
  // Añadir configuración de MongoDB (por si la API REST también la necesita)
  database: {
    uri: process.env.DATABASE_URL || process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/wallet_db',
  }
});