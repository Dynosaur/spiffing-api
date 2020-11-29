import { chalk } from 'tools/chalk';
import { MongoClient as DbClient, Db } from 'mongodb';

export class MongoClient {

    db: Db;

    constructor(private databaseUrl: string,
                private databaseName: string,
                private verbose = true) { }

    async initialize(): Promise<void> {
        if (this.db) {
            chalk.rust('\tDatabase already initialized');
            return;
        }
        if (this.verbose) {
            chalk.cyan('\tStarting mongo client');
            chalk.cyan('\t\tConnecting to ' + this.databaseUrl);
        }

        return new Promise((resolve, reject) => {
            const client = new DbClient(this.databaseUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            client.connect(err => {
                if (err) {
                    if (this.verbose) {
                        chalk.rust('\t\tEncountered an error while attempting to connect to the database.');
                    }
                    reject(err);
                    return;
                } else if (this.verbose) {
                    chalk.lime('\tSuccessfully connected');
                }

                this.db = client.db(this.databaseName);
                if (this.verbose) {
                    chalk.lime('\tMongoDB client successfully initialized');
                }
                resolve();
            });
        });
    }
}
