import { Server } from './server/server';
import * as dotenv from 'dotenv';

dotenv.config();

if (process.env.PORT === undefined)
    process.env.PORT = '47680';
if (process.env.environment === undefined)
    throw new Error('.env did not specify an \'environment\' field, please set to "PROD", "DEV", or "TEST".');
if (process.env.DB_URL === undefined)
    throw new Error('.env did not specify a \'DB_URL\' field.');
if (process.env.KEY === undefined)
    throw new Error('.env did not specify a \'KEY\' field.');

const server = new Server();
server.start(parseInt(process.env.PORT)).catch(error => {
    console.log(error); // eslint-disable-line no-console
    process.exit(1);
});
