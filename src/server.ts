import * as cors from 'cors';
import * as Express from 'express';
import * as chalk from 'chalk';
import { MongoClient } from './mongo-client';
import { DB_NAME } from './const';
import { UserActions } from './database-actions/user-actions';

class Server {

    private express = Express();
    private mongoClient: MongoClient;
    private userActions: UserActions;

    private async initialize(): Promise<void> {
        console.log(chalk.cyanBright('Initializing server.'));
        this.mongoClient = new MongoClient(DB_NAME);
        await this.mongoClient.initialize();
        this.userActions = new UserActions(this.mongoClient.getDatabase());
        this.configureExpress();
    }

    private configureExpress(): void {
        this.express.use(Express.urlencoded({ extended: true }));
        this.express.use(Express.json());
        this.express.use(cors({
            origin: '*'
        }));

        this.express.get('/', (req, res) => {
            res.send({ message: 'No data to send.'});
        });

        this.express.get('/users', async (req, res) => {
            const query: any = {};
            if (req.headers.username) {
                query.name = req.headers.username;
            }
            if (req.headers.password) {
                query.password = req.headers.password;
            }
            if (req.headers.id) {
                query._id = req.headers.id;
            }
            console.log(query);
            const users = await this.userActions.get(query);
            if (users) {
                res.send(users);
            } else {
                res.status(400).send({
                    message: 'No users found',
                    queryUsername: query.username,
                    queryPassword: query.password
                });
                console.log(chalk.red('No users found with query: ' + JSON.stringify(query, null, 4)));
            }
        });

        this.express.post('/user', (req, res) => {
            if (req.body.username) {
                if (req.body.password) {
                    this.userActions.create(req.body.username, req.body.password);
                    console.log(chalk.greenBright('Created new user: ' + req.body.username));
                    res.status(201).send({ message: 'OK' });
                } else {
                    console.log(chalk.redBright('Could not create new user: no password provided in body.'));
                    res.status(400).send({ error: 'Missing password' });
                }
            } else {
                console.log(chalk.redBright('Could not create new user: no username provided in body.'));
                res.status(400).send({ error: 'Missing username' });
            }
        });

        this.express.delete('/user', (req, res) => {
            if (req.body.username) {
                this.userActions.delete(req.body.username);
                console.log(chalk.greenBright('Deleted user: ' + req.body.username));
                res.sendStatus(200);
            } else {
                console.log(chalk.redBright('Could not delete user: ' + req.body.username));
                res.sendStatus(400);
            }
        });

        // this.app.get('/api/user/:id', (req, res) => {
        //     res.json({
        //         name: 'Alejandro',
        //         age: 4
        //     });
        // });
        // this.app.post('/api/user/:id', (req, res) => {
        //     console.log(req.params.id);
        //     res.status(202);
        //     res.end();
        // });
    }

    public start(port: number): void {
        this.initialize().then(() => {
            this.express.listen(port, () => console.log(chalk.yellowBright(`Listening on port ${port}`)));
        });
    }
}


const server = new Server();
server.start(3005);