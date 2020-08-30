import * as chalk from 'chalk';
import { MongoClient as monc, Db, Collection } from 'mongodb';
import { MONGODB_URL, DB_COLLECTIONS } from './const';

export class MongoClient {

    private database: Db;
    private localCollections: Collection<any>[];
    private collections: Map<string, Collection<any>> = new Map();

    constructor(private databaseName: string) { }

    public getDatabase(): Db {
        return this.database;
    }

    public initialize(): Promise<void> {
        console.log(chalk.magentaBright('Initializing MongoDB Client.'));
        return new Promise((resolve, reject) => {
            monc.connect(MONGODB_URL, (err, db) => {
                if (err) {
                    reject(err);
                }
                console.log(chalk.magentaBright('MongoDB successfully connected.'));
                this.setUp(db).then(() => resolve()).catch(reason => reject(reason));
            });
        });
    }

    private async setUp(db: monc): Promise<void> {
        this.database = db.db(this.databaseName);
        this.localCollections = await this.database.collections();

        console.log(chalk.magentaBright('MongoDB Client initialized.'));
    }

    private async createCollection(name: string): Promise<void> {
        console.log(chalk.magentaBright('Creating Collection ' + name));
        this.localCollections.push(await this.database.createCollection(name));
    }
}