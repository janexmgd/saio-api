import { failedResponse } from '../helpers/response.js';
export default (err, req, res, next) => {
  failedResponse(res, {
    code: err.code || 500,
    status: 'error',
    message: err.message || 'internal server error',
    stack: err.stack ? err.stack : {},
    details: err.details || null,
  });
};
