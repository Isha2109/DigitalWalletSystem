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
        type: Number,
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
        type: Number,
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
        type: Number
    },
    closingBalance:{
        type: Number
    }
});
var transactionSchema  = mongoose.model('Transaction', transactionSchema);
var walletSchema = mongoose.model('Wallet', walletSchema)

module.exports = {
    transactionSchema, walletSchema
}