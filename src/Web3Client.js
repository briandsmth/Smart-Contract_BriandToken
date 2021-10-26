import Web3 from 'web3';

import BriandTokenSale from 'contracts/BriandTokenSale.json';
import BriandToken from 'contracts/BriandToken.json';

let selectedAccount;

export const init = async () => {
    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {

        provider
            .request({ method: 'eth_requestAccounts' }).then((accounts) => {
                selectedAccount = accounts[0]
                console.log(`Selected account is ${selectedAccount}`)
            })
            .catch((err) => {
                console.log(err)
            })
        window.ethereum.on('accountsChanged', (accounts) => {
            selectedAccount = accounts[0]
            console.log(`selected account changed to ${selectedAccount}`)
        })
    }
    const web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();


    const briandTokenSaleData = BriandTokenSale.networks[networkId]
    const briandTokenSale = new web3.eth.Contract(
        BriandTokenSale.abi, 
        briandTokenSaleData
        );

    const briandTokenData = BriandToken.networks[networkId]
    const briandToken = new web3.eth.Contract(
        BriandToken.abi, 
        briandTokenData
        );
}