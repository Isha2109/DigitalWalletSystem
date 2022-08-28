let url = 'http://localhost:3000/'

function getWalletByName() {
    let walletName = document.getElementById('walletName').value;
    url += `wallet/${walletName}`
    console.log(url)
    fetch(url, { method: 'GET'})
    .then(response => response.json())
    .then(data => {
        if(data.status === "ok"){
            alert('Invalid Username\nRedirecting to Wallet Setup Page')
            window.location.replace('http://127.0.0.1:5500/Frontend/Setup.html')
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