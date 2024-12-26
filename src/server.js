import express from 'express';

import cors from 'cors';
import protectMiddleware from './middleware/protect.middleware.js';
import errorHandler from './utils/errorHandler.js';
import createError from './utils/createError.js';
import selectService from './helpers/selectService.js';
import { successResponse } from './helpers/response.js';

const server = express();
server.use(express.json());
server.use(cors());
server.use(protectMiddleware);
server.get('/', (req, res, next) => {
  successResponse(res, {
    code: 200,
    message: 'ok',
  });
});
server.post('/service', async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body?.url) {
      throw createError('400', 'invalid input');
    }
    const { url } = req.body;
    const data = await selectService(url);
    successResponse(res, {
      code: 200,
      ...data,
    });
  } catch (error) {
    next(error);
  }
});
server.use(errorHandler);
export default server;
