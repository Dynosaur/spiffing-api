import { chalk } from 'tools/chalk';
import { MongoClient as DbClient, Db } from 'mongodb';

export class MongoClient {

    client: DbClient;
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

        const client = new DbClient(this.databaseUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.client = await client.connect();
        if (this.verbose) chalk.lime('\tSuccessfully connected');
        this.db = this.client.db(this.databaseName);
        if (this.verbose) chalk.lime('\tMongoDB client successfully initialized');
    }

}
