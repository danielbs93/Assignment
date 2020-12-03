# Cognni Assignment
<br />
Creator: Daniel Ben-Simon.<br />
Written in JavaScript.<br />

## Configurations
<br />
A. For each folder in this repository {Generator, Reciever, Server} open a new project in VS Code or any other developer tooling support JS.<br />
<br />
B. Generator & Receiver: <br />
    1. create .env file, for each, with the next following lines: <br />
        algorithm=aes-256-ctr <br />
        crypto_key=coGnNiAssignMent2020DBS1993keY12 <br />
        iv=16 <br />

C. Server: <br />
    1. create .env file with the next following lines: <br />
        COOKIE_SECRET=daniel@cognni_assignment <br />
        bcrypt_saltRounds=13 <br />

## Available Scripts

### First, for each project run:
#### `npm i`
<br />
Builds the app for production and creates the node_modules folder.<br />

### Generator activation:
#### `npm start report_interval_argument`
<br />
report_interval_argument - number, that represents seconds, the interval for sending to the server report.<br />

### Receiver activation:
#### `npm start path report_interval_argument`
<br />
path - dir path for saving messages & calculations from the Generator.<br />
report_interval_argument - number, that represents seconds, the interval for sending to the server report.<br />

### Server activation:
#### `npm start path`
<br />
path - dir path for saving reports from the Generator & Receiver.<br />
        In the same dir path we will save the .logger file as well.<br />

### Debugging
#### `npm debug *options`
<br />
For each project with their matching arguments we can run this debugging script.<br />

<br />
~ Your apps is ready to be deployed! ~ <br />

## Used modules & tools
- nodemon<br />
- amqplib<br />
- express<br />
- bodyParser<br />
- dotenv<br />
- morgan<br />
- session<br />
- cookieParser<br />
- cors<br />
- fs<br />
- os<br />
- path<br />
- axios<br />
