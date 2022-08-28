const { walletSchema }= require('../models/model')
const { transactionSchema }= require('../models/model')
const {getTransactionId}= require('../general/general')

async function makeTransaction(transactObj){
   // console.log(request)
    //check if walletID exists, check the type of transactn by +ve or -ve amount, get balance of wallet, initially set opening and closing balance as wallet balance
    //check balance > amount(for debit),  diff for credit and debit, update db with type, and balance
    try{
        data = await walletSchema.findOne({id: transactObj.walletId},{_id:0, __v:0}) //walletId exists
        if(data){
            transactObj.transactionId = getTransactionId()
            transactObj.date = new Date()
            transactObj.openingBalance=parseFloat(data.balance).toFixed(4);
            transactObj.amount = parseFloat(transactObj.amount).toFixed(4)
            if(transactObj.openingBalance < transactObj.amount && transactObj.amount < 0){
                return { status:"error", message:"insufficient balance" }
            }
            else if(transactObj.amount == 0){
                return { status:"error", message:"please enter an amount to proceed"}
            }
                if(transactObj.amount < 0) transactObj.type = 'DEBIT'
                else transactObj.type = 'CREDIT';
                console.log(transactObj.amount)
                transactObj.closingBalance = parseFloat(eval(transactObj.openingBalance + '+' + transactObj.amount)).toFixed(4)
                transactObj.amount = parseFloat(transactObj.type ==="CREDIT" ? transactObj.amount : transactObj.amount*-1).toFixed(4)
                try{
                    let request = new transactionSchema(transactObj)
                    ok = await request.save()
                    if(ok) {
                         ok = await walletSchema.updateOne({id : transactObj.walletId},{$set:{balance: transactObj.closingBalance}})
                         if(ok.modifiedCount){
                            responseData = {
                                id : transactObj.walletId,
                                transactionId : transactObj.transactionId,
                                type: transactObj.type,
                                balance : transactObj.closingBalance,
                                date : transactObj.date,
                                description : transactObj.description,
                                amount : transactObj.amount
                            }
                            return {status:"ok", message:"transaction successful", data: responseData }
                         }
                         else{
                            return {status:"error",message:"wallet balance not updated, rollback transaction"}
                         }
                    }
                    else return {status:"error", message:"transaction failed"}
                
                }
                catch(e){
                    console.log(e)
                    return {status:"error", message:"transaction failed"}
                }                        
    } else{
            return {status:"error", message: "walletId does not exist"}
        }
    }
    catch(ex){
        console.log(ex)
        return {status:"error", message: "an unknown error occured"}
    }

}



async function fetchTransactionsByWalletId(filterObj){

    try{
        data = await transactionSchema.find({walletId:filterObj.walletId},{_id:0, __v:0},
            {
                skip:filterObj.skip,
                limit: filterObj.limit,
                sort: filterObj.sort
            })
            console.log(data.length)
        if(data){
            return {status:"ok", message:"transactions fetched", data: data}
        }
        else return {status:"not found", message:"walletId does not exist"}
    }
    catch(ex){
        return {status:"error", response: "an unknown error occured"}
    }
}

async function fetchTransactionsBySorting(filterObj){ //2 functions for sorting by date and amount?
   
    data = await transactionSchema.find({id:filterObj.id},
    ['transactionId', 'id', 'openingBalance', 'ClosingBalance', 'date', 'amount', 'type', 'description'],
    {
        skip:{skip},
        limit:{limit},
        sort:{date: -1}
    },
    function(err,docs){
        // Do something with the array of 10 objects
    })
}


module.exports = { makeTransaction, fetchTransactionsByWalletId }