//----Importing the libraries
require("dotenv").config();
var amqp = require('amqplib/callback_api'); //  Message queue module 
const axios = require('axios'); // Sending requests
const my_cryptor = require('./myCryptor'); // my cryptor for decrypt and encrypte messages

const os = require('os');
const fs = require('fs');
const path = require('path');


//----Fields----
// Specifying the folder path for saving results
const dir_path = process.argv.slice(2)[0] || os.tmpdir();
const messages_file = path.join(dir_path, '/generator_messages.txt');
// Report sending interval by seconds
const report_interval = process.argv.slice(2)[1]*1000 || 5000;
// Last session received number
var last_response_number = null;
var last_response_calculation = null;
const server_url = "http://localhost:4000";

// Writing new file to given dir path or to the temp dir in the system
fs.writeFile(messages_file , `Started at time: ${new Date().toISOString()}\n`, function (err) {
    if (err) throw err;
  });

//RabbitMQ connection creation
amqp.connect("amqp://localhost:5672", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    // Creating channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
        throw error1;
        }
        var QUEUE = 'Execute';
        
        // Creating new Queue
        channel.assertQueue(QUEUE, {durable: false});

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE);

        //Getting messages
        channel.consume(QUEUE, function(msg) {
            //Parsing Json and retrieving the message
            let payload = JSON.parse(msg.content.toString());

            //Decrypting data
            pay_load = {
                number: parseInt(my_cryptor.decrypt(payload.number)),
                action: my_cryptor.decrypt(payload.action),
                time_stamp: my_cryptor.decrypt(payload.time_stamp)
            }
            printedMessage = `Recieved message: [Number: ${pay_load.number}, Operation: ${pay_load.action} at time: ${pay_load.time_stamp}]`;
            console.log(printedMessage);
            printedAction="";
            // First number arrived
            if (last_response_number == null) {
                last_response_number = pay_load.number
                // last_response_calculation = pay_load.number
            }
            // Calaculations by the action provided
            else {
                if (pay_load.action == "Add") {
                    printedAction = `Addition action 1: ${last_response_number} + ${pay_load.number} = ${last_response_number+pay_load.number}`;
                    // console.log(`Addition action 2: ${last_response_calculation} + ${pay_load.number} = ${last_response_calculation+pay_load.number}`)
                    // last_response_calculation = last_response_calculation+pay_load.number
                }
                else {
                    printedAction = `Multiplication action 1: ${last_response_number} * ${pay_load.number} = ${last_response_number*pay_load.number}`;
                    // console.log(`Multiplication action 2: ${last_response_calculation} * ${pay_load.number} = ${last_response_calculation*pay_load.number}`)
                    // last_response_calculation = last_response_calculation*pay_load.number
                }
                last_response_number = pay_load.number
            }
            console.log(printedAction);
            
            // Appending to file the data
            fs.appendFile(messages_file, printedMessage + "\n" + printedAction + "\n", function (err) {
                if (err) throw err;
                });
        }, {
            noAck: true
        });
    });
});

// Sending message to the server every X-(given argument) minutes
setInterval(async () => {
    try {
        var data = {
            sender: 'Receiver',
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
    console.log("Receiver is closed")
    process.exit()
});
