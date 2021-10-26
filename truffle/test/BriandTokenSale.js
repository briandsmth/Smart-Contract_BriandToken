const BriandToken = artifacts.require("BriandToken");
const BriandTokenSale = artifacts.require("BriandTokenSale");

contract('BriandTokenSale', (accounts) => {
    let briandTokenSale;

    const admin = accounts[0];
    const buyer = accounts[1];
    const tokenPrice = 1000000000000000; // in wei
    const tokensAvailable = 750000;
    // const numberOfTokens;

    before(async () => {
        briandToken = await BriandToken.new()
        briandTokenSale = await BriandTokenSale.new(briandToken.address, tokenPrice)
    })

    describe('Testing for the sale contract', async () => {
        it('initializes the contract with the correct values', async () => {
            const address = await briandTokenSale.address
            assert.notEqual(address, 0x0, 'has contract address')

            const tokenaddress = await briandTokenSale.tokenContract()
            assert.notEqual(tokenaddress, 0x0, 'has the token contract address')

            const price = await briandTokenSale.tokenPrice()
            assert.equal(price, tokenPrice, 'token price is correct')
        })

        it('facilitates token buying', async () => {
            // Provision 75% of all tokens to the token sale
            await briandToken.transfer(briandTokenSale.address, tokensAvailable, { from: admin })

            numberOfTokens = 10;
            const receipt = await briandTokenSale.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
            assert.equal(receipt.logs.length, 1, 'triggers one event')
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event')
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens')
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased')

            const amount = await briandTokenSale.tokensSold()
            assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold')

            const balanceBuyer = await briandToken.balanceOf(buyer)
            assert.equal(balanceBuyer.toNumber(), numberOfTokens)

            const balance = await briandToken.balanceOf(briandTokenSale.address)
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens)

            // Try to buy tokens different from the ether value
            await briandTokenSale.buyTokens(numberOfTokens, { from: buyer, value: 1 }).then(assert.fail).catch(async (error) => {
                assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
                return await briandTokenSale.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice })
            }).then(assert.fail).catch(async (error) => { assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available') })
        })

        it('ends token sale', async()=>{
            // Try to end sale from account other than the admin
            await briandTokenSale.endSale({from : buyer}).then(assert.fail).catch(async(error)=>{
                assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'))
            })

            // try to End sale as admin
            await briandTokenSale.endSale({from : admin})

            const balanceAdmin = await briandToken.balanceOf(admin)
            assert.equal(balanceAdmin.toNumber(), 999990, 'returns all unsold dapp tokens to admin')

            // Check that the contract has no balance
            const balance = await web3.eth.getBalance(briandTokenSale.address)
            assert.equal(balance, 0);
        })
    })
})