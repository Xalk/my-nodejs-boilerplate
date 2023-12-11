import express from 'express';
import swaggerUi from 'swagger-ui-express';

import authRouter from './authRouter';
import swaggerSpec from '../../config/swagger.js';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);

// docs
v1Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default v1Router;
