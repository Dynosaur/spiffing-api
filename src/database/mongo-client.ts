import { chalk } from 'tools/chalk';
import { MongoClient as DbClient, Db, Collection } from 'mongodb';

export class MongoClient {
    private client!: DbClient;
    private db!: Db;

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

        try {
            this.client = await client.connect();
        } catch (error) {
            if (error.message === 'Invalid connection string') throw new Error(`Could not connect using database url: ${this.databaseUrl}`);
            throw new Error(error);
        }

        if (this.verbose) chalk.lime('\tSuccessfully connected');
        this.db = this.client.db(this.databaseName);
        if (this.verbose) chalk.lime('\tMongoDB client successfully initialized');
    }

    async close(): Promise<void> {
        if (process.env.environment === 'TEST') await this.db.dropDatabase();
        await this.client.close();
    }

    getCollection(name: string): Collection {
        return this.db.collection(name);
    }

    dropDatabase(): Promise<void> {
        return this.db.dropDatabase();
    }

}
