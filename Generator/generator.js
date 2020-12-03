//----Importing the libraries
require("dotenv").config();
const amqp = require('amqplib/callback_api'); //  Message queue module 
const credentials_amqp = require('amqplib/lib/credentials'); // authnection rabbitMQ users
const axios = require('axios');
const my_cryptor = require('./myCryptor');

//---Server local url
const server_url = "http://localhost:4000";
// Report sending interval by seconds
const report_interval = process.argv.slice(2)[0]*1000 || 5000;

// Authentication: only 'guest' is acceptable in local host
const opt = { credentials: credentials_amqp.plain('guest', 'guest') };

// Step 1: Create connection
amqp.connect('amqp://localhost:5672', opt,  function(err, conn) {

  if (err) {
      throw err;
  }

  // Step 2: Create channel
  conn.createChannel(function(err, ch) {

    // Assert queue
    var QUEUE = 'Execute';

    ch.assertQueue(QUEUE, {durable: false});

    setInterval(() => {
        // Preparing message
        // adding time stamp
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        random_number = getRndInteger(1, 100000);
        random_action = getRandAction();

        message_before_encryption = `[number: ${random_number}, action: ${random_action}, time: ${dateTime}]`;

        var msg = {
            number: my_cryptor.encrypt((random_number).toString()),
            action: my_cryptor.encrypt(random_action),
            time_stamp: my_cryptor.encrypt(dateTime)
        };
        
        // Json converter
        let payloadAsString = JSON.stringify(msg);

        // Step 4: Send message to queue
        ch.sendToQueue(QUEUE, Buffer.from(payloadAsString));

        console.log(`Message: ${message_before_encryption} sent to ${QUEUE} queue`);
    }, 1000);   
  });
});

/**
 * 
 * @param {min value for generating random number} min 
 * @param {min value for generating random number} max 
 * 
 * Calling function: ambq.connect -> setInterval
 */
function getRndInteger(min, max) {
    return (Math.floor(Math.random() * (max - min) ) + min);
}

/**
 * Choosing between 2 operations "Add" or "Multiply" for sending the message queue
 * 
 * Generate random number (0,1) and transform it into binary option 
 * 
 * Calling function: ambq.connect -> setInterval
 */
function getRandAction() {
    // 0 means Addition, 1 means Multiplication
    let choice = Math.round(Math.random());
    if (choice == 0) {
        return "Add"
    }
    else {
        return "Multiply"
    }
}

// Sending message to the server every X-(given argument) minutes
setInterval(async (next) => {
    try {
        var data = {
            sender: 'Generator',
            time_stamp: new Date().toISOString()
        };
        var response = await axios.post(
            server_url + '/status',
            {data},
            {withCredentials: true}
        );
        console.log(response.data);
    }
    catch(err){
        console.log(err.message);
    }
}, report_interval);

//Closing the process with a message
process.on("SIGINT", function () {
    console.log("Generator is closed")
    process.exit()
});