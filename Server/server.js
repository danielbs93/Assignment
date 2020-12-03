//----Importing the libraries
require("dotenv").config();
const express = require("express");// Server module
const bodyParser = require("body-parser");// Requests parser module
const morgan = require("morgan");// Logger module
const session = require("client-sessions"); // Authentication module
const cookieParser = require('cookie-parser');

const fs = require("fs");
const os = require("os");
const path = require('path');

// Specifying the folder path for saving results
const dir_path = process.argv.slice(2)[0] || os.tmpdir();

// Letting all origins to pass
const cors = require("cors");

const corsConfig = {
    origin: true,
    credentials: true
};

//creating a write stream, in append mode, so we don’t overwrite the old logs everytime we write a new one.
let logStream = fs.createWriteStream(path.join(dir_path, '/logger.log'), {flags: 'a'});

//Report file
fs.writeFile(path.join(dir_path, '/report.txt'), `Started at time: ${new Date().toISOString()}\n`, function (err) {
    if (err) throw err;
  });

//----App settings and configurations
const app = express();
const port = process.env.PORT || "4000";
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(morgan(":method :url :status :response-time ms"));
app.use(cookieParser())

//Cross origin definition 
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//----Fields----
var receiver_info = {
    status: null,
    last_time_stamp: null // the most updated time stamp of a report by the receiver
};
var generator_info = {
    status: null,
    last_time_stamp: null // the most updated time stamp of a report by the generator
};


//Session settings
app.use (
    session({
        cookieName: "session", // cookie name
        secret: process.env.COOKIE_SECRET, //encryption key
        duration: 60*30*1000, // expires after 1800 seconds
        activeDuration: 0, //if expiresIn < activeDuration the session will be extended by activeDuration (ms)
        cookie: {
            httpOnly: false,
        },
    })
);

// Cookie middleware authentication
app.use("/report", async function(req, res, next) {
    if (req.cookies.user_id) {
        //Simulating access to DB for authenticate the user
        //  this function returns true in the 'user_exist' value
        let user_exist = await this.execQuery(`SELECT user_id FROM users WHERE user_id LIKE '${req.cookies.user_id}'`);
        if (user_exist) {
            req.userID = user_exist.userID;
            next();
        }
        else {
            res.status(404).send({message: "User does not exist", success: false});
        }
    } else {
        res.status(401).send({message: "Unauthorized client connection", success: false});
    }
});

// setup the logger and its reporting type 
app.use(morgan('combined', { stream: logStream }))

//----Checking if the app is alive
app.get ("/alive", (req,res) => {
    res.send("I'm alive!");
});

// An endpoint for receiving reports from the client apps
app.post("/status", async (req,res, next) => {
    try {
        data = req.body.data;
        updateClientTimeStamp(data);
        content = `Content: [Sender: ${data.sender} with status: Active at time: ${data.time_stamp}]`;
        console.log(content);
        await saveIncomingReport(content);
        res.status(200).send("Report received successfully");
    }
    catch(err) {
        next(err);
    }
});

// An endpoint to retreive the report from the client apps
app.get("/report", async (req,res,next) => {
    try {
        updateCurrentClientsStatus();
        await saveIncomingReport(`Snap: [Receiver with status: ${receiver_info.status} at time ${new Date().toISOString()}]`);
        await saveIncomingReport(`Snap: [Generator with status: ${generator_info.status} at time ${new Date().toISOString()}]`);    
        var report = await readReport();
        console.log(report);
        res.status(200).send(report);
    }
    catch(err) {
        next(err);
    }
});

//Throwing the error into response after next-function is used by an error
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({message: err.message, success: false});
})

// Server listening
const server = app.listen(port, () => {
    console.log(`App listening on port ` + port);
});


//Closing the process in case server is down
process.on("SIGINT", function () {
    if (server) {
        server.close(() => console.log("Server is down"))
    }
    console.log("Server is closed")
    process.exit()
});

/**
 * Updating the time stamps of a client
 * 
 * Calling function: app.post(/status)
 * 
 * TODO: support more than 2 clients -> making the client_info a list with unique id for each client
 */
updateClientTimeStamp = function (data) {
    //Receiver
    if (data.sender == "Receiver") {
        receiver_info.last_time_stamp = data.time_stamp;
    }
    //Generator
    else {
        generator_info.last_time_stamp = data.time_stamp;
    }
}

/**
 * Assigning the status of a client
 * 
 * Calling function: app.get("/report")
 */
updateCurrentClientsStatus = function() {
    receiver_info.status = getStatusByMinute(receiver_info);
    generator_info.status = getStatusByMinute(generator_info);
}

/**
 * Checks if there was a status report in the last minute and updating the status according to it
 * 
 * -- if there was a report from the client app in the last minute report: Active
 * -- else report: Inactive
 * 
 * Calling function: updateCurrentClientsStatus
 */
getStatusByMinute = function(info) {
    // No report arrived yet
    if (info.last_time_stamp == null){
        return "Inactive";
    }

    //Calculating the time difference
    current_time = new Date().toISOString();
    last_report_time = new Date(info.last_time_stamp);
    dif = Math.abs(Date.parse(current_time)-Date.parse(last_report_time));
    
    //Measuring time by minutes
    if (dif/60000 <= 1) {
        return "Active";
    }
    else {
        return "Inactive";
    }
}

/**
 * Saving one incoming status report
 * 
 * Calling function: app.post(/status) + app.get("/report")
 */
saveIncomingReport = async function (content) {
    // Appending to file the data
    fs.appendFileSync(path.join(dir_path, '/report.txt'), content + "\n", function (err) {
        if (err) throw err;
      });
}

/**
 * Reading the report file before sending it.
 * 
 * Calling function: app.get("/report")
*/
readReport = async function () {
    let report = fs.readFileSync(path.join(dir_path, '/report.txt'), 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        // console.log(data);
      });
    return report;
}

/**
 * Execute generic query function that simulates DB access 
 * 
 * Returning true for userID existence
 * 
 * Calling function: middleware of app in the authentication session
 */
execQuery = async function (query) {
    try {
        // Assuming we locate the necessary data by executing the query 
        // For now we return an object with true value as its authorized data from the DB 
        user ={userID: true}
      return true;
    } catch (err) {
      console.error("SQL error", err);
      throw err;
    }
  }