# highlevel

Welcome to HighWallet, NodeJS CRUD Application to implement Digital Wallet System

Steps to Run Application:

URL for the website: http://52.66.195.190:8080

POSTMAN API's-

CREATE WALLET: POST http://52.66.195.190:8080/setup BODY { "name":"newWal21", "balance":"1000.000006", "username":"Isha" }

VIEW WALLET: GET http://52.66.195.190:8080/wallet/a1ab776e

MAKE TRANSACTION: POST http://52.66.195.190:8080/transact/a1ab776e BODY { "amount":"-700.08", "description":"buy chips" }

GET TRANSACTIONS BY WALLET ID: GET http://52.66.195.190:8080/transactions?walletId=a1ab776e&limit=5&skip=2

GET WALLET BY USERNAME: GET http://52.66.195.190:8080/walletByUsername/isha.lal

Export CSV: GET http://52.66.195.190:8080/transactions/exportToCSV?walletId=a1ab776e