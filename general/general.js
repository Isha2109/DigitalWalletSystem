const crypto = require("crypto");

function getWalletId(){
    var walletId = crypto.randomBytes(4).toString("hex");
    return walletId
 }

 function getTransactionId(){
    var transactionId = crypto.randomBytes(8).toString("hex");
    return transactionId
 }

 module.exports= {
    getWalletId, getTransactionId
}

