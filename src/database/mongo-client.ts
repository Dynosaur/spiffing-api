import { chalk } from '../tools/chalk';
import { MongoClient as DbClient, Db } from 'mongodb';
import ServerConfig from '../server-config';

const config: ServerConfig = require('../../server-config.json');
const databaseUrl = config['database-url'];

export class MongoClient {

    public db: Db;

    constructor(private databaseName: string) { }

    public initialize(): Promise<void> {
        chalk.orange('Initializing MongoDB Client.');

        return new Promise((resolve, reject) => {
            DbClient.connect(databaseUrl, (err, db) => {
                if (err) reject(err);
                chalk.orange('MongoDB successfully connected.');
                this.db = db.db(this.databaseName);
                chalk.orange('MongoDB Client initialized.');
                resolve();
            });
        });
    }
}