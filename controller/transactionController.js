const { walletSchema }= require('../models/model')
const { transactionSchema }= require('../models/model')
const {getTransactionId}= require('../general/general')
var { createObjectCsvWriter}  = require('csv-writer')
const { uploadFileFunction,getPresignedUrl } = require('../config/s3')
const {convertNumbertoFourPrecision} = require('../transformer/transformer')



async function makeTransaction(transactObj){
    try{
        data = await walletSchema.findOne({id: transactObj.walletId},{_id:0, __v:0})
        if(data){
            transactObj.transactionId = getTransactionId()
            transactObj.date = new Date()
            transactObj.openingBalance = data.balance
            transactObj.amount = transactObj.amount
            if(transactObj.openingBalance < transactObj.amount && transactObj.amount < 0){
                return { status:"error", message:"insufficient balance" }
            }
            else if(transactObj.amount == 0){
                return { status:"error", message:"please enter an amount to proceed"}
            }
                if(transactObj.amount < 0) transactObj.type = 'DEBIT'
                else transactObj.type = 'CREDIT';
                transactObj.closingBalance = transactObj.openingBalance + transactObj.amount
                transactObj.amount = transactObj.type ==="CREDIT" ? transactObj.amount : transactObj.amount*-1
                console.log(transactObj)
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
                                balance : convertNumbertoFourPrecision(transactObj.closingBalance),
                                date : transactObj.date,
                                description : transactObj.description,
                                amount : convertNumbertoFourPrecision(transactObj.amount)
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
            data = data.map(val=> {
                return {
                    transactionId: val.transactionId,
                    amount: convertNumbertoFourPrecision(val.amount),
                    description: val.description,
                    type: val.type,
                    date: val.date,
                    walletId: val.walletId,
                    openingBalance: convertNumbertoFourPrecision(val.openingBalance),
                    closingBalance: convertNumbertoFourPrecision(val.closingBalance)
                }
            })
        if(data.length == 0){
            return {status:"ok", message:"no transactions available", data: data}
        }
        else if(data.length > 0){
            return {status:"ok", message:"transactions fetched", data: data}
        }
        else return {status:"not found", message:"walletId does not exist"}
    }
    catch(ex){
        return {status:"error", response: "an unknown error occured"}
    }
}

async function getCSV(walletId){
        try{
            data = await transactionSchema.find({walletId: walletId},{_id:0, __v:0}) //transactions against walletId
            if(data){
                var filename = `${walletId}-transactionStatement.csv`
                var path ="/tmp/" + filename
                var createCsvWriter = createObjectCsvWriter
                const csvWriter = createCsvWriter({
                    path: path,
                    header: [
                      {id: 'transactionId', title: 'transactionId'},
                      {id: 'amount', title: 'amount'},
                      {id: 'description', title: 'description'},
                      {id: 'type', title: 'type'},
                      {id: 'date', title: 'date'},
                      {id: 'walletId', title: 'walletId'},
                      {id: 'openingBalance', title: 'openingBalance'},
                      {id: 'closingBalance', title: 'closingBalance'}
                    ]
                  });
                  let result = []
                  data = data.map(val=> {
                    result.push(
                        {
                            transactionId: val.transactionId,
                            amount: convertNumbertoFourPrecision(val.amount),
                            description: val.description,
                            type: val.type,
                            date: val.date,
                            walletId: val.walletId,
                            openingBalance: convertNumbertoFourPrecision(val.openingBalance),
                            closingBalance: convertNumbertoFourPrecision(val.closingBalance)
                        }
                    )
                })
                try{
                    await csvWriter.writeRecords(result)
                } catch(e){
                    return {status:"error", message:"could not convert to csv file"}
                }              
                console.log('Data uploaded into csv successfully')
                ok = await uploadFileFunction(filename, path)
                if(ok.status === 'ok'){
                    presinedUrl = getPresignedUrl(filename)
                    return { status:"ok", data:presinedUrl }
                }
                else{
                    return {status:"error", message:"upload failed"}
                }
            } else{
                return {status:"error", message:"no transactions available"}
            }
        }
        catch(ex){
            console.log(ex)
            return {status:"error", response: "an unknown error occured"}
        }
}


module.exports = { makeTransaction, fetchTransactionsByWalletId, getCSV }