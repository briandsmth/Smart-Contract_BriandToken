import { Component } from "react";



class Main extends Component {
    render() {
        return (
            <div id="content" className="mt-3">
                <div class="container" style="width: 650px;">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1 class="text-center">BRIAND TOKEN ICO SALE</h1>
                            <hr />
                            <br />
                        </div>
                        <div id="loader">
                            <p class="text-center">Loading...</p>
                        </div>
                        <div id="content" class="text-center" style="display: none;">
                            <p>
                                Introducing "BND Token" (BRIAND)!
                                Token price is <span class="token-price">Balance : {window.web3.utils.fromwei(this.props.tokenPrice, 'Ether')}</span> Ether. You currently have <span class="briand-balance">{window.web3.utils.fromwei(this.props.briandTokenBalance, 'Ether')}</span>&nbsp;BND.
                            </p>
                            <br />
                            <form onSubmit={(event) => {
                                event.preventDefault()
                                let numberOfTokens
                                numberOfTokens = this.input.value.toString()
                                numberOfTokens = window.web3.utils.toWei(numberOfTokens, 'Ether')
                                this.props.buyTokens(numberOfTokens)
                            }} role="form">
                                <div class="form-group">
                                    <div class="input-group">
                                        <input className="form-control form-control-lg" ref={(input) => { this.input = input }} type="number" name="number" value="1" min="1" pattern="[0-9]">
                                        </input>
                                        <span class="input-group-btn">
                                            <button type="submit" class="btn btn-primary btn-lg" onClick={(event) => {
                                                event.preventDefault()
                                                this.props.buyTokens()
                                            }}>Buy Tokens</button>
                                        </span>
                                    </div>
                                </div>
                            </form>

                            <div class="progress">
                                <div id="progress" class="progress-bar progress-bar-striped active" aria-valuemin="0" aria-valuemax="100">
                                </div>
                            </div>
                            <p><span className="float-left">Balance : {window.web3.utils.fromwei(this.props.tokensSold)}</span> / <span class="float-right">Balance : {window.web3.utils.fromwei(this.props.tokensAvailable)}</span> tokens sold</p>

                            <p id="accountAddress">{this.props.selectedAccount}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;