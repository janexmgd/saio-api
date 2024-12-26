import 'dotenv/config';
import server from './src/server.js';
const port = process.env.APP_PORT;
if (!port) {
  const err = new Error('set env APP_PORT ');
  throw err;
}
server.listen(port, '0.0.0.0', () => {
  console.log(`server running at port ${port}`);
});
