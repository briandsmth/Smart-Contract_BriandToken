import React, { Component} from "react"
import { buyTokens } from "./Web3Client"
import BriandTokenSale from 'contracts/BriandTokenSale.json'
import BriandToken from 'contracts/BriandToken.json'
import Web3 from 'web3'
import Main from './Main'
import Navbar from './Navbar'

class App extends Component{


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData (){
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()


    //Load BriandTokenSale Data
    const briandTokenSaleData = BriandTokenSale.networks[networkId]
    if (briandTokenSaleData) {
      const briandTokenSale = new web3.eth.Contract(
        BriandTokenSale.abi,
        briandTokenSaleData.address
      )
      let tokenPrice = await briandTokenSale.methods.tokenPrice().call()
      this.setState({ tokenPrice: tokenPrice.toString() })
      let tokensSold = await briandTokenSale.methods.tokensSold().call()
      this.setState({ tokensSold: tokensSold.toString() })
      // this.setState({ tokensAvailable: tokensAvailable.toString() })
      // tokensAvailable
    } else {
      window.alert('BriandTokenSale contract not deployed to detected network.')
    }

    //Load BriandToken Data
    const briandTokenData = BriandToken.networks[networkId]
    if (briandTokenData) {
      const briandToken = new web3.eth.Contract(
        BriandToken.abi,
        briandTokenData.address
      )
      this.setState({ briandToken })
        let briandTokenBalance = await briandToken.methods.balanceOf(this.state.account).call()
        this.setState({ briandTokenBalance: briandTokenBalance.toString() })
    } else {
      window.alert('BriandToken contract not deployed to detected network.')
    }
    
    this.setState({ loading: false })

    // this.state.listenForEvents();
  }

  listenForEvents(){
    //listenForEvents    
    this.state.briandTokenSale.methods.Sell({}, {
      fromBlock: 0,
      toBlock: 'latest',
    }).watch((error, event) => {
      console.log("event triggered", event)
      this.state.render();
    })
  }

  render() {
    //render
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        briandTokenBalance={this.state.briandTokenBalance}
        tokensAvailable={this.state.tokensAvailable}
        tokensSold={this.state.tokensSold}
        tokenPrice={this.state.tokenPrice}
        buyTokens={this.buyTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://github.com/briandsmth/Smart-Contract_BriandToken"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
    


    // $('#accountAddress').html("Your Account: " + selectedAccount);

    // tokenPrice = await briandTokenSale.methods.tokenPrice();
    // $('.token-price').html(web3.fromWei(tokenPrice, "ether").toNumber());

    // tokensSold = await briandTokenSale.methods.tokensSold();
    // $('.tokens-sold').html(tokensSold);
    // $('.tokens-available').html(tokensAvailable);

    // const progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
    // $('#progress').css('width', progressPercent + '%');

    // balance = await briandToken.methods.balanceOf(selectedAccount);
    // $('.briand-balance').html(balance.toNumber());

    // loading = false;
    // loader.hide();
    // content.show();
  }

  buyTokens = (numberOfTokens) => {
    this.setState({ loading: true })

    this.state.briandTokenSale.methods.buyTokens(numberOfTokens, {
        from: this.state.account,
        value: numberOfTokens * this.state.tokenPrice,
        gas: 500000 // gas limit
    })

    console.log("Token bought...")
    this.setState({ loading: false })
}

constructor(props) {
  super(props)
  this.state = {
    account : '0x0',
    briandTokenSale : {},
    briandToken : {},
    briandTokenBalance     : '0',
    tokenPrice : '1000000000000000',
    tokensSold : '0',
    tokensAvailable : '750000',
    loading: true
  }
}

}

export default App;
