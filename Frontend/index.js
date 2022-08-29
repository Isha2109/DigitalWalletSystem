let url = 'http://localhost:3000/'
const redirectUrl = 'http://127.0.0.1:5500/'

function getWalletByName() {
    let username = document.getElementById('username').value;
    url += `walletByUsername/${username}`
    fetch(url, { method: 'GET'})
    .then(response => response.json())
    .then(data => {
        if(data.status === "ok"){
            localStorage.setItem("walletId", data.walletId)
            window.location.replace(redirectUrl+'Frontend/')
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
    let balance = document.getElementById('balance').value;
    url += 'setup'
    const body = {
        name: walletName,
        balance: balance
    }
    console.log(body)
    console.log(JSON.stringify(body))
    // fetch(url, { method: 'POST', body: JSON.stringify(body), headers: {'Content-Type': 'application/json'} })
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data)
    // })
}