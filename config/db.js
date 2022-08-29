var mongoose = require('mongoose')

const dbUrl = "mongodb+srv://user001:user001@clusterpassport.gquk8.mongodb.net/?retryWrites=true&w=majority";


function createDBConn(){
    mongoose.connect(dbUrl,{useNewUrlParser: true});

    mongoose.connection.on('connected', function(){
        console.log("Mongoose default connection is open to ", dbUrl);
    });

    mongoose.connection.on('error', function(err){
        console.log("Mongoose default connection has occured "+err+" error");
    });

    mongoose.connection.on('disconnected', function(){
        console.log("Mongoose default connection is disconnected");
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });
}

module.exports = {
    createDBConn
}