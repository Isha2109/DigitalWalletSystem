const url = 'http://52.66.195.190:3000/'
const redirectUrl = 'http://52.66.195.190:8080/'
//const url = 'http://localhost:3000/'
// const redirectUrl = 'http://127.0.0.1:5500/Frontend'

function getWalletByName() {
    let username = document.getElementById('username').value;
    newUrl = url + `walletByUsername/${username}`
    fetch(newUrl, { method: 'GET'})
    .then(response => response.json())
    .then(data => {
        if(data.status === "ok"){
            localStorage.setItem("walletId", data.walletId)
            window.location.replace(redirectUrl+'/viewWallet.html')
        }
        else {
            alert(data.message)
            if(data.message === "Wallet not Found"){
                window.location.replace(redirectUrl+'/setup.html')
            }
        }
    })
}

function setupWallet() {
    let walletName = document.getElementById('walletName').value;
    let balance = document.getElementById('walletAmount').value;
    let username = document.getElementById('username').value;
    newUrl = url + 'setup'
    const body = {
        name: walletName,
        balance: balance,
        username: username
    }
    console.log(body)
    fetch(newUrl, { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
    .then(response => response.json())
    .then(data => {
        if(data.status === "ok"){
          console.log(data.data[0])
            localStorage.setItem("walletId", data.data[0].id)
            window.location.replace(redirectUrl+'/viewWallet.html')
        } else {
            alert(data.message)
            document.getElementById('walletName').value = ''
            document.getElementById('walletAmount').value = ''
            document.getElementById('username').value = ''
        }
    })
}

function getTransactions() {
  walletId = localStorage.getItem('walletId')
  const pageNo = document.getElementById("pageNo").innerText
  let skip
  if(pageNo == 1){
    skip = 0
  } else skip = (Number(pageNo) - 1) * 10
  console.log(pageNo)
  console.log(skip)
   newUrl = url + 'transactions' + '?walletId=' + walletId + '&skip='+ skip + '&limit=10'
   console.log(newUrl)
   fetch(newUrl, { method: 'GET'})
   .then(response => response.json())
   .then(data => {
     if(data.status === "ok"){
        addDataToTable(data.data)
     } else {
        alert(data.message)
     }
   })
}

function addDataToTable(arr){
    if(arr.length === 0) {
        alert("No transactions found \n Redirecting to Make Transaction Page")
        window.location.replace(redirectUrl + '/doTransactions.html')
    }
    deleteTableData()
    let tableBody = document.getElementById('transcationResult')
    let count = 0
    for (i in arr) {
        node = document.createElement('tr')
        tableBody.appendChild(node)
        tdNode8 = document.createElement('td')
        tdNode8.innerText = ++count
        node.appendChild(tdNode8)
        tdNode1 = document.createElement('td')
        tdNode1.innerText = arr[i]["transactionId"]
        node.appendChild(tdNode1)
        tdNode2 = document.createElement('td')
        tdNode2.innerText = arr[i]["walletId"]
        node.appendChild(tdNode2)
        tdNode3 = document.createElement('td')
        tdNode3.innerText = arr[i]["type"]
        node.appendChild(tdNode3)
        tdNode4 = document.createElement('td')
        tdNode4.innerText = arr[i]["amount"]
        node.appendChild(tdNode4)
        tdNode5 = document.createElement('td')
        tdNode5.innerText = arr[i]["description"]
        node.appendChild(tdNode5)
        tdNode6 = document.createElement('td')
        tdNode6.innerText = arr[i]["date"]
        node.appendChild(tdNode6)
        tdNode7 = document.createElement('td')
        tdNode7.innerText = arr[i]["openingBalance"]
        node.appendChild(tdNode7)
        tdNode8 = document.createElement('td')
        tdNode8.innerText = arr[i]["closingBalance"]
        node.appendChild(tdNode8)
    }
}

function getWalletById(){
  let walletId = localStorage.getItem("walletId");
  let newUrl = url + `wallet/${walletId}`
  fetch(newUrl, { method: "GET" })
  .then(response => response.json())
  .then(data => {
    walletObj = data.data[0]
    const div1 = document.getElementById("walletName")
    div1.innerHTML = walletObj.name
    const div2 = document.getElementById("balance")
    div2.innerHTML = walletObj.balance
    const div3 = document.getElementById("walletId")
    div3.innerHTML = walletObj.id
    const div4 = document.getElementById("createdAt")
    div4.innerHTML = moment(walletObj.date).format("DD MMM YYYY")
    const p = document.getElementById("username")
    p.innerHTML = walletObj.username
  })
}

function makeTransaction(){
  const walletId = localStorage.getItem("walletId")
  const amount = document.getElementById("amount").value
  const description = document.getElementById("description").value
  const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
  const newUrl = url + `transact/${walletId}`
  const body = {
    amount : transactionType === 'debit' ? amount*-1 : amount,
    description : description
  }
  fetch(newUrl , { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
  .then(response => response.json())
  .then(data => {
    if(data.status === "ok"){
      alert("Transaction Successful")
    } else {
      alert(data.message)
    }
    document.getElementById("amount").value = ''
    document.getElementById("description").value = ''
  })
}

function redirectToDoTransacationPage(){
  window.location.replace(redirectUrl+'/doTransaction.html')
}

function redirectToViewTransactionPage(){
  window.location.replace(redirectUrl+'/viewTransactions.html')
}

function redirectToWalletPage(){
  window.location.replace(redirectUrl+'/viewWallet.html')
}

function sortTransactions(){
  const pageNo = document.getElementById("pageNo").innerText
  let skip
  if(pageNo == 1){
    skip = 0
  } else skip = pageNo * 10
  const walletId = localStorage.getItem("walletId")
  const sort = document.getElementById("sortBy").value
  const sortBy = document.getElementById("orderBy").value
  newUrl = url + 'transactions' + '?walletId=' + walletId + '&sort=' + sort + '&sortType=' + sortBy + '&skip=' + skip + '&limit=10'
  fetch(newUrl, { method: 'GET'})
   .then(response => response.json())
   .then(data => {
     if(data.status === "ok"){
        addDataToTable(data.data)
     } else {
        alert(data.message)
     }
   })
}

function deleteTableData(){
  var e = document.getElementById("transcationResult");
        
  //e.firstElementChild can be used.
  var child = e.lastElementChild; 
  while (child) {
      e.removeChild(child);
      child = e.lastElementChild;
  }
}

function navigateToNextPage(){
  const pageNo = document.getElementById("pageNo").innerText
  if(pageNo == 1){
    const ele = document.getElementById("previousBtn")
    ele.disabled = false
  }
  document.getElementById("pageNo").innerText = Number(pageNo) + 1
  getTransactions()
}

function navigateToPreviousPage(){
  const pageNo = document.getElementById("pageNo").innerText
  if(pageNo == 2){
    const ele = document.getElementById("previousBtn")
    ele.disabled = true
  }
  document.getElementById("pageNo").innerText = Number(pageNo) - 1
  getTransactions()
}

function downloadCSV(){
  const walletId = localStorage.getItem("walletId")
  const newUrl = url + 'transactions/exportToCSV?walletId=' + walletId
  fetch(newUrl, { method: 'GET'})
   .then(response => response.json())
   .then(data => {
     if(data.status === "ok"){
        fetch(data.data, { method: 'GET' ,headers: { 'Access-Control-Allow-Origin':'http://127.0.0.1:5500','Access-Control-Allow-Credentials': 'true' }}).then(
          console.log("Done")
        )
     } else {
        alert(data.message)
     }
   })
}