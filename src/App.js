import React, { Component} from "react";
import { buyTokens } from "./Web3Client";
import BriandTokenSale from 'contracts/BriandTokenSale.json';
import BriandToken from 'contracts/BriandToken.json';
import Web3 from 'web3';

class App extends Component{

  async componentWillMount() {
    await this.init()
  }

  init = async () => {
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
    briandTokenSale = new web3.eth.Contract(
      BriandTokenSale.abi,
      briandTokenSaleData
    );

    const briandTokenData = BriandToken.networks[networkId]
    briandToken = new web3.eth.Contract(
      BriandToken.abi,
      briandTokenData
    );
    let briandTokenBalance = await briandToken.methods.balanceOf(selectedAccount).call()
    this.setState({ briandTokenBalance: briandTokenBalance.toString() })

    await listenForEvents();
    return render();
  }

  listenForEvents = async () => {
    //listenForEvents    
    briandTokenSale.methods.Sell({}, {
      fromBlock: 0,
      toBlock: 'latest',
    }).watch((error, event) => {
      console.log("event triggered", event)
      render();
    })
  }

  render = async () => {
    //render
    if (loading) {
      return;
    }

    this.setState({loading = true});

    const loader = $('#loader');
    const content = $('#content');

    loader.show();
    content.hide();

    $('#accountAddress').html("Your Account: " + selectedAccount);

    tokenPrice = await briandTokenSale.methods.tokenPrice();
    $('.token-price').html(web3.fromWei(tokenPrice, "ether").toNumber());

    tokensSold = await briandTokenSale.methods.tokensSold();
    $('.tokens-sold').html(tokensSold);
    $('.tokens-available').html(tokensAvailable);

    const progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
    $('#progress').css('width', progressPercent + '%');

    balance = await briandToken.methods.balanceOf(selectedAccount);
    $('.briand-balance').html(balance.toNumber());

    loading = false;
    loader.hide();
    content.show();
  }

  buyTokens = () => {
    $('#content').hide();
    $('#loader').show();

    const numberOfTokens = $('#numberOfTokens').val();
    this.state.briandTokenSale.methods.buyTokens(numberOfTokens, {
        from: selectedAccount,
        value: numberOfTokens * tokenPrice,
        gas: 500000 // gas limit
    })

    console.log("Token bought...")
    $('form').trigger('reset')
}

constructor(props) {
  super(props)
  this.state = {
    selectedAccount : '0x0',
    briandTokenSale : '0',
    briandToken     : '0',
    tokenPrice : '1000000000000000',
    tokensSold : '0',
    tokensAvailable : '750000',
    loading: true
  }
}


  return <div className="App">
    <div class="container" style="width: 650px;">
      <div class="row">
        <div class="col-lg-12">
          <h1 class="text-center">DAPP TOKEN ICO SALE</h1>
          <hr />
          <br />
        </div>
        <div id="loader">
          <p class="text-center">Loading...</p>
        </div>
        <div id="content" class="text-center" style="display: none;">
          <p>
            Introducing "DApp Token" (DAPP)!
            Token price is <span class="token-price"></span> Ether. You currently have <span class="briand-balance"></span>&nbsp;DAPP.
          </p>
          <br />
          <form onSubmit="App.buyTokens(); return false;" role="form">
            <div class="form-group">
              <div class="input-group">
                <input id="numberOfTokens" class="form-control input-lg" type="number" name="number" value="1" min="1" pattern="[0-9]">
                </input>
                <span class="input-group-btn">
                  <button type="submit" class="btn btn-primary btn-lg" onClick={() => buyTokens()}>Buy Tokens</button>
                </span>
              </div>
            </div>
          </form>

          <div class="progress">
            <div id="progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
            </div>
          </div>
          <p><span class="tokens-sold"></span> / <span class="tokens-available"></span> tokens sold</p>

          <p id="accountAddress"></p>
        </div>
      </div>
    </div>
  </div>
}

export default App;
