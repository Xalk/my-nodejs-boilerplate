import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Boilerplate API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },

  // looks for configuration in specified directories
  apis: ['./src/routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
