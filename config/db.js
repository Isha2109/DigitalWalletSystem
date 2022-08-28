var mongoose = require('mongoose')

var chalk = require('chalk')

const dbUrl = "mongodb+srv://user001:user001@clusterpassport.gquk8.mongodb.net/?retryWrites=true&w=majority";

var connected = chalk.bold.cyan;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;


function createDBConn(){
    mongoose.connect(dbUrl,{useNewUrlParser: true});

    mongoose.connection.on('connected', function(){
        console.log(connected("Mongoose default connection is open to ", dbUrl));
    });

    mongoose.connection.on('error', function(err){
        console.log(error("Mongoose default connection has occured "+err+" error"));
    });

    mongoose.connection.on('disconnected', function(){
        console.log(disconnected("Mongoose default connection is disconnected"));
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log(termination("Mongoose default connection is disconnected due to application termination"));
            process.exit(0)
        });
    });
}

module.exports = {
    createDBConn
}