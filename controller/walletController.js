const { walletSchema }= require('../models/model')
const {convertNumbertoFourPrecision} = require('../transformer/transformer')

async function setupWallet(setupObj){
    let request = new walletSchema(setupObj)
    try{
        if(request.balance=== undefined || request.balance == null){request.balance = 0}
        await request.save();
        data = await walletSchema.find({id: setupObj.id},{_id:0, __v:0, transactionId:0})
        data = data.map(val => {
            return {
                name: val.name,
                id: val.id,
                date: val.date,
                balance: convertNumbertoFourPrecision(val.balance)
            }
        })
        if(data) return {status:"ok", message: data}
        else return {status:"error", message: "an unknown error occured"}
    }
    catch(ex){
        console.log(ex)
        return {status:"error", message:"an unknown error occured"}
    }
}

async function getWalletById(id){
    try{
        data = await walletSchema.find( { id: id },{ _id:0,__v:0 })
        data = data.map(val => {
            return {
                name: val.name,
                id: val.id,
                date: val.date,
                balance: convertNumbertoFourPrecision(val.balance)
            }
        })
        if(data) {return {status:"ok", message: data} }
        else return {status:"error", message: "an unknown error occured"}

    }
    catch(ex){
        console.log(ex)
        return {status:"ok", message: "an unknown error occured"}
    }
}

async function getWalletByUsername(username){
    try{
        ok = await walletSchema.findOne( { username:username },{ id:1 }, { _id:0, __v:0 })
        if(ok) return {status:"ok", message:"walletId fetched", data : ok.id}
        else return { status:"error", message:"wallet not found" } 
    }
    catch(ex){
        return {status:"error", message: "an unknown error occured"}
    }

}

module.exports = {setupWallet, getWalletById, getWalletByUsername }