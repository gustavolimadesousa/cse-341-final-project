const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentation',
    description: 'API documentation for the project',
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
};
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];


// Generate the swagger.json file
swaggerAutogen(outputFile, endpointsFiles, doc);