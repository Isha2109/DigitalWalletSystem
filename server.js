const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const { createDBConn } = require('./config/db')
const {setupWallet, getWalletById , getWalletByUsername} = require('./controller/walletController')
const { getWalletId} =  require('./general/general')
const { makeTransaction, fetchTransactionsByWalletId, getCSV} = require('./controller/transactionController')
require(`dotenv`).config()
var { Parser } = require('json2csv')

app.use(bodyParser.json({}))
app.use(cors())
createDBConn();

app.get('/', function(req, res) {
    res.status(200).send({status:"ok", message:"incorrect path"})
})

app.post('/setup', async function(req, res) {
    let setupObj ={
        balance: Number(req.body.balance),
        name: req.body.name,
        username: req.body.username,
        id : getWalletId(),
        date : new Date()
    }
    ok = await setupWallet(setupObj)
    if(ok.status ==="error")
    { 
        if(ok.message === "wallet already exists") res.status(400).send({status:"error", message:"wallet already exists for user"})
        else res.status(400).send({status:"error", message:"Wallet Setup Failed"})
    }
    else res.status(200).send({status:"ok", message: "user wallet created successfully", data: ok.message})
})

app.get('/walletByUsername/:username', async function(req, res) {
    let username = req.params.username
    ok = await getWalletByUsername(username)

    if(ok.status == "error"){
        if(ok.message ==="an unknown error occured"){
            res.status(404).send({status:"error", message:"Could not fetch wallet Details"})
        }
        else if(ok.message==="wallet not found"){
            res.status(404).send({status:"error", message:"Wallet not Found"})
        }
    }
    else res.status(200).send({status:"ok", message:"walletId fetched", walletId: ok.data})
})

app.get('/wallet/:id', async function(req, res) {
    let walletId = req.params.id
    ok = await getWalletById(walletId)
    if(ok.message ==="an unknown error occured")
    { 
        res.status(404).send({status:"ok", message:"could not fetch wallet details"})
    }
    else res.status(200).send({status:"ok", message: "user wallet details", data: ok.message})
})

app.post('/transact/:walletId', async function(req,res){
    let transactObj ={
        walletId : req.params.walletId,
        amount: Number(req.body.amount),
        description: req.body.description
    }
    ok = await makeTransaction(transactObj)
    if(ok.status==="error"){
        if(ok.message ==="an unknown error occured"){
            res.status(404).send({status:"ok", message:"an unknown error occured"})
        }
        else if(ok.message==="walletId does not exist"){
            res.status(404).send({status:"ok", message:"walletId does not exist"})
        }
        else if(ok.message==="please enter an amount to proceed"){
            res.status(400).send({status:"ok", message:""})
        }
        else if(ok.message==="insufficient balance"){
            res.status(400).send({status:"ok", message:"insufficient balance"})
        }
        else if(ok.message==="wallet balance not updated, rollback transaction"){
            res.status(404).send({status:"ok", message:"wallet balance not updated, rollback transaction"})
        }
    }
    else{
        res.status(200).send({status:"ok", message:"Your transaction was successful", data: ok.data})
    }
})


app.get('/transactions', async function(req, res){
    let filterObj = {
        walletId : req.query.walletId,
        skip : req.query.skip ? req.query.skip : 0,
        limit : req.query.limit ? req.query.limit :0 
    }
    if(req.query.sort) {
        filterObj.sort = req.query.sort === "date" ? { date : req.query.sortType === "asc" ? 0 : -1 } : { amount : req.query.sortType === "asc" ? 0 : -1 }
    }
    ok = await fetchTransactionsByWalletId(filterObj)

    if(ok.message==="an unknown error occured"){
        res.status(400).send({status:"error", message:"transaction failed, please try again"})
    }
    else if(ok.message==="walletId does not exist"){
        res.status(400).send({status:"error", message:"walletId does not exist"})
    }
    else res.status(200).send({status:"ok", message: "Transaction Details", data: ok.data})
})

app.get('/transactions/exportToCSV', async function(req, res){
    let walletId = req.query.walletId
    ok = await getCSV(walletId)
    if(ok.status === "ok"){
        res.status(200).send(ok)
    }else{
        res.status(400).send(ok)
    }

})

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`connection open on ${process.env.PORT || 3000}`)
})
