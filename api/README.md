# spiffing-api

A MEAN (MongoDB, Express.js, Angular, Node.js) stack for a social media clone of Reddit.

## Running locally

Note: instructions are written with Windows operating system in mind.

1. [Have `Node.js` and `npm` installed](https://nodejs.org/en)
    - [(OPTIONAL) Have MongoDB installed locally](https://www.mongodb.com/try/download/community), though you can also use Atlas to host the DB for free, just set your DB_URL to the Atlas connection string
    - If you *are* running locally, ensure the `mongod` process is running. If you installed it as a service, it should always be running, if not you will have to run it manually by navigating to the
    MongoDB installation directory, inside the `bin` dir, run `mongod.exe`. Example path: `C:\Program Files\MongoDB\Server\7.0\bin`
    - To check if Mongo is running locally, use cURL to send a request: `curl localhost:27017`. You should receive a response that looks like: `It looks like you are trying to access MongoDB over HTTP on the native driver port.`
2. `npm install` in the project directory
3. Create .env file in the project directory. DO NOT ADD THIS TO SOURCE CONTROL, it contains sensitive data (DB credentials). Example for the content of the file below:
    - The value for KEY must be in lowercase, and is expected to be a hexadecimal string of 32 bytes (Which would be 64 ASCII characters, as there are 2 characters per byte)
```
environment=DEV
DB_URL=0.0.0.0:27017
KEY=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef
```
4. Run `npm start`, and the API will begin running! Visit http://localhost:47680/ in your browser.

## User Interface

The user interface is precompiled from an Angular project, the source code for which is NOT available in this repo. The user interface code can be found [here](https://github.com/Dynosaur/spiffing)
