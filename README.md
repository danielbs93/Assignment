# Cognni Assignment
<br />
Created by Daniel Ben-Simon.<br />
Written in JavaScript.<br />

## Configurations
<br />
A. For each folder in this repository {Generator, Reciever, Server} open a new project in VS Code or any other developer tooling support JS.<br />
<br />
B. Generator & Receiver: <br />
&nbsp &nbsp 1. create .env file, for each, with the next following lines: <br />
&nbsp &nbsp &nbsp &nbsp algorithm=aes-256-ctr <br />
&nbsp &nbsp &nbsp &nbsp crypto_key=coGnNiAssignMent2020DBS1993keY12 <br />
&nbsp &nbsp &nbsp &nbsp iv=16 <br />
<br />
C. Server: <br />
&nbsp &nbsp 1. create .env file with the next following lines: <br />
&nbsp &nbsp &nbsp &nbsp COOKIE_SECRET=daniel@cognni_assignment <br />
&nbsp &nbsp &nbsp &nbsp bcrypt_saltRounds=13 <br />
&nbsp &nbsp 2. Before using the endpoint '/report' for getting status snapshot from the server: <br />
&nbsp &nbsp &nbsp &nbsp Create a cookie and set it in the header of the request, for eample in the Postman:<br /><br />
<p align="center">
  <img src="https://github.com/danielbs93/Assignment/blob/main/postman-cookie-example.png" width="650" title="Postman cookie example">
</p>

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
&nbsp &nbsp &nbsp In the same dir path we will save the .logger file as well.<br />

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
