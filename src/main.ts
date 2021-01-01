import { Server } from './server/server';
import * as dotenv from 'dotenv';

dotenv.config();

const server = new Server();
server.start(parseInt(process.env.PORT)).catch(error => {
    console.log(error); // eslint-disable-line
    process.exit(1);
});
