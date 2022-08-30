const url = 'http://localhost:3000/'
const redirectUrl = 'http://127.0.0.1:5500/'

function getWalletByName() {
    let username = document.getElementById('username').value;
    newUrl = url + `walletByUsername/${username}`
    fetch(newUrl, { method: 'GET'})
    .then(response => response.json())
    .then(data => {
        if(data.status === "ok"){
            localStorage.setItem("walletId", data.walletId)
            window.location.replace(redirectUrl+'Frontend/viewWallet.html')
        }
        else {
            alert(data.message)
            if(data.message === "Wallet not Found"){
                window.location.replace(redirectUrl+'Frontend/setup.html')
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
    fetch(newUrl, { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
    .then(response => response.json())
    .then(data => {
        if(data.status === "ok"){
            localStorage.setItem("walletId", data.walletId)
            window.location.replace(redirectUrl+'Frontend/viewWallet.html')
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
   if(!walletId) {
    alert("Session Expired \n Please login again")
    window.location.replace(redirectUrl+'Frontend/index.html')
   }
   newUrl = url + 'transactions' +'?walletId='+walletId
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
        window.location.replace(redirectUrl + 'Frontend/doTransactions.html')
    }
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

function sortamount(c) {
    var l = c.length;
    var f;
    for (var i = 0; i < l; i++) {
      f = c[i].amount.sort();
    }
    return f;
  }
  function sortBy() {
    if (sort == true) {
      sort = "date";
    } else sort = "amount";
    console.log(sort);
    data = document.getElementById("sort-date").checked == true;
    if (data) {
      sort = "date";
    } else {
      sort = "amount";
    }
    console.log(sort);
    if (document.getElementById("sort-date").checked) {
      var sort = document.getElementById("sort-radio").checked;
      var l = arr.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c - d;
      });
      document.getElementById("sort-date").innerHTML = sort;
    } else if (document.getElementById("sort-amount").checked) {
      var sort = document.getElementById("sort-amount").value;
      var k = sortamount(arr);
      document.getElementById("sort-amount").innerHTML = sort;
    }
    walletId = localStorage.getItem("walletId");
    if (!walletId) {
      alert("Session Expired \n Please login again");
      window.location.replace(redirectUrl + "Frontend/index.html");
    }
    newUrl = url + "transactions" + "?walletId=" + walletId + "?sort=" + sort;
    fetch(newUrl, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          addDataToTable(data.data);
          arr = data.data;
        } else {
          alert(data.message);
        }
      });
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
    document.getElementById("balance").value = ''
    document.getElementById("description").value = ''
  })
}
  