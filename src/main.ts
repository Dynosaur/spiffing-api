import { Server } from './server/server';
import * as dotenv from 'dotenv';

dotenv.config();

const server = new Server();
server.start(parseInt(process.env.PORT));