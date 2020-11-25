import { chalk } from 'tools/chalk';
import { MongoClient as DbClient, Db } from 'mongodb';

export class MongoClient {

    db: Db;

    constructor(private databaseUrl: string, private databaseName: string) { }

    async initialize(): Promise<void> {
        chalk.cyan('Initializing MongoDB Client.');
        chalk.cyan('Connecting to ' + this.databaseUrl);

        return new Promise((resolve, reject) => {
            const client = new DbClient(this.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect(err => {
                if (err) {
                    chalk.rust('Encountered an error while attempting to connect to the database.');
                    reject(err);
                    return;
                }

                this.db = client.db(this.databaseName);
                chalk.lime('MongoDB client successfully initialized.');
                resolve();
            });
        });
    }
}
