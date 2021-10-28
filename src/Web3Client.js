import Web3 from 'web3';

import BriandTokenSale from 'contracts/BriandTokenSale.json';
import BriandToken from 'contracts/BriandToken.json';
import { render } from '@testing-library/react';


// let selectedAccount 
// let briandTokenSale
// let briandToken
// let loading = false
// let tokenPrice = 1000000000000000
// let tokensSold = 0
// let tokensAvailable = 750000

// export const init = async () => {
//     let provider = window.ethereum;

//     if (typeof provider !== 'undefined') {

//         provider
//             .request({ method: 'eth_requestAccounts' }).then((accounts) => {
//                 selectedAccount = accounts[0]
//                 console.log(`Selected account is ${selectedAccount}`)
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//         window.ethereum.on('accountsChanged', (accounts) => {
//             selectedAccount = accounts[0]
//             console.log(`selected account changed to ${selectedAccount}`)
//         })
//     }
//     const web3 = new Web3(provider);

//     const networkId = await web3.eth.net.getId();


//     const briandTokenSaleData = BriandTokenSale.networks[networkId]
//     briandTokenSale = new web3.eth.Contract(
//         BriandTokenSale.abi,
//         briandTokenSaleData
//     );

//     const briandTokenData = BriandToken.networks[networkId]
//     briandToken = new web3.eth.Contract(
//         BriandToken.abi,
//         briandTokenData
//     );
//     let briandTokenBalance = await briandToken.methods.balanceOf(selectedAccount).call()
//     this.setState({briandTokenBalance: briandTokenBalance.toString()})

//     await listenForEvents();
//     return render();
// }

// const listenForEvents = async () => {
//     //listenForEvents    
//     briandTokenSale.methods.Sell({}, {
//         fromBlock: 0,
//         toBlock: 'latest',
//     }).watch((error, event) => {
//         console.log("event triggered", event)
//         await render();
//     })
// }

// const render = async () => {
//     //render
//     if (loading) {
//         return;
//     }

//     loading = true;

//     const loader = $('#loader');
//     const content = $('#content');

//     loader.show();
//     content.hide();

//     $('#accountAddress').html("Your Account: " + selectedAccount);

//     tokenPrice = await briandTokenSale.methods.tokenPrice();
//     $('.token-price').html(web3.fromWei(tokenPrice, "ether").toNumber());

//     tokensSold = await briandTokenSale.methods.tokensSold();
//     $('.tokens-sold').html(tokensSold);
//     $('.tokens-available').html(tokensAvailable);

//     const progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
//     $('#progress').css('width', progressPercent + '%');

//     balance = await briandToken.methods.balanceOf(selectedAccount);
//     $('.briand-balance').html(balance.toNumber());

//     loading = false;
//     loader.hide();
//     content.show();
// }

// export const buyTokens = () => {
//     $('#content').hide();
//     $('#loader').show();

//     const numberOfTokens = $('#numberOfTokens').val();
//     briandTokenSale.methods.buyTokens(numberOfTokens, {
//         from: selectedAccount,
//         value: numberOfTokens * tokenPrice,
//         gas: 500000 // gas limit
//     })

//     console.log("Token bought...")
//     $('form').trigger('reset')
// }