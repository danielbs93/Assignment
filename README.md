# Cognni Assignment

Creator: Daniel Ben-Simon.
Written in JavaScript.

## Configurations

A. For each folder in this repository {Generator, Reciever, Server} open a new project in VS Code or any other developer tooling support JS.

B. Generator & Receiver: 
    1. create .env file, for each, with the next following lines:
        algorithm=aes-256-ctr
        crypto_key=coGnNiAssignMent2020DBS1993keY12
        iv=16

C. Server:
    1. create .env file with the next following lines:
        COOKIE_SECRET=daniel@cognni_assignment
        bcrypt_saltRounds=13
  
## Available Scripts

### First, for each project run:
#### `npm i`

Builds the app for production and creates the node_modules folder.<br />

### Generator activation:
#### `npm start report_interval_argument`

report_interval_argument - number, that represents seconds, the interval for sending to the server report.

### Receiver activation:
#### `npm start path report_interval_argument`

path - dir path for saving messages & calculations from the Generator.
report_interval_argument - number, that represents seconds, the interval for sending to the server report.

### Server activation:
#### `npm start path`

path - dir path for saving reports from the Generator & Receiver.
        In the same dir path we will save the .logger file as well.

### Debugging
#### `npm debug *options`

For each project with their matching arguments we can run this debugging script.


* Your apps is ready to be deployed! *

## Used modules & tools
- nodemon
- amqplib
- express
- bodyParser
- dotenv
- morgan
- session
- cookieParser
- cors
- fs
- os
- path
- axios
