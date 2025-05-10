export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  soapService: {
    url: process.env.SOAP_SERVICE_URL || 'http://localhost:8000/wallet-service?wsdl',
  },
  swagger: {
    title: 'Virtual Wallet API',
    description: 'REST API for Virtual Wallet Service',
    version: '1.0',
  }
});