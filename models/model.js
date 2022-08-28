const mongoose=require('mongoose')

var Schema = mongoose.Schema

var walletSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    balance:{
        type: String,
    },
    id:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    }
});

var transactionSchema = new Schema({
    transactionId:{
        type: String
    },
    amount:{
        type: String,
    },
    description:{
        type: String
    },
    type:{
        type: String
    },
    date:{
        type: Date
    },
    walletId:{
        type: String
    },
    openingBalance:{
        type: String
    },
    closingBalance:{
        type: String
    }
});
var transactionSchema  = mongoose.model('Transaction', transactionSchema);
var walletSchema = mongoose.model('Wallet', walletSchema)

module.exports = {
    transactionSchema, walletSchema
}