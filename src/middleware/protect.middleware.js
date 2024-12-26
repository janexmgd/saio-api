import createError from '../utils/createError.js';

const protectMiddleware = async (req, res, next) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      throw createError(400, 'invalid headers');
    }
    next();
  } catch (error) {
    next(error);
  }
};
export default protectMiddleware;
