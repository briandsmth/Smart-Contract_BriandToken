const BriandToken = artifacts.require("BriandToken");


contract('BriandToken', (accounts) => {
    let briandToken

    before(async () => {
        briandToken = await BriandToken.new()
    })

    describe('Initializes the contract with the correct values', async () => {
        it('has a name', async () => {
            const name = await briandToken.name()
            assert.equal(name, 'Briand Token')
        })

        it('has a symbol', async () => {
            const symbol = await briandToken.symbol()
            assert.equal(symbol, 'BND')
        })

        it('has a standard', async () => {
            const symbol = await briandToken.standard()
            assert.equal(symbol, 'Briand Token v1.0')
        })
    })

    describe('allocates the initial supply upon deployment', async () => {
        it('sets the total supply to 1,000,000', async () => {
            const totalSupply = await briandToken.totalSupply()
            assert.equal(totalSupply.toNumber(), 1000000)
        })

        it('it allocates the initial supply to the admin account', async () => {
            const adminBalance = await briandToken.balanceOf(accounts[0])
            assert.equal(adminBalance.toNumber(), 1000000)
        })

    })

    describe('testing for transfer transaction', async () => {
        it('transfers token ownership', async () => {
            // Test `require` statement first by transferring something larger than the sender's balance
            await briandToken.transfer.call(accounts[1], 9999999999999).then(assert.fail).catch((error) => {
                assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
            })

            //Test for transfer success
            const success_transfer = await briandToken.transfer.call(accounts[1], 200000, { from: accounts[0] })
            assert.equal(success_transfer, true, 'it returns true');

            //Test to catch the logs for the transfer
            const receipt = await briandToken.transfer(accounts[1], 200000, { from: accounts[0] })
            assert.equal(receipt.logs.length, 1, 'triggers one event')
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from')
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to')
            assert.equal(receipt.logs[0].args._value, 200000, 'logs the transfer amount')

            //Test for check destination accounts transfer
            const balance_to = await briandToken.balanceOf(accounts[1])
            assert.equal(balance_to.toNumber(), 200000, 'adds the amount to the receiving account')

            //Test for check transfer account from
            const balance_from = await briandToken.balanceOf(accounts[0])
            assert.equal(balance_from.toNumber(), 800000, 'deducts the amount from the sending account')
        })
    })

    describe('testing for approve tokens', async () => {
        it('approves tokens for delegated transfer', async () => {
            //test for approve success
            const succes_approve = await briandToken.approve.call(accounts[1], 100)
            assert.equal(succes_approve, true, 'it returns true');

            //test to catch logs for the approve transaction
            const receipt = await briandToken.approve(accounts[1], 100, { from: accounts[0] })
            assert.equal(receipt.logs.length, 1, 'triggers one event')
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event')
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by')
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to')
            assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount')

            //test for allowance
            allowance = await briandToken.allowance(accounts[0], accounts[1])
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer')
        })
    })

    describe('handles delegated token transfers', async () => {
        it('handles delegated token transfers', async () => {
            let tokenInstance = await BriandToken.new()
            let fromAccount = accounts[2]
            let toAccount = accounts[3]
            let spendingAccount = accounts[4]

            //Testing Transfer some tokens to fromAccount
            await tokenInstance.transfer(fromAccount, 100, { from: accounts[0] })

            //Testing Approve spendingAccount to spend 10 tokens form fromAccount
            await tokenInstance.approve(spendingAccount, 10, { from: fromAccount })

            // Try to catch error transferring something larger than the sender's balance
            await tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount }).then(assert.fail).catch((error) => {
                assert(
                    error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance')
            })

            // Try transferring something larger than the approved amount
            await tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount }).then(assert.fail).catch((error) => {
                assert(
                    error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount')
            })

            const success = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount })
            assert.equal(success, true)

            const receipt = await tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount })
            assert.equal(receipt.logs.length, 1, 'triggers one event')
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event')
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from')
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transferred to')
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount')

            const balanceSending = await tokenInstance.balanceOf(fromAccount)
            assert.equal(balanceSending.toNumber(), 90, 'deducts the amount from the sending account')

            const balanceReceive = await tokenInstance.balanceOf(toAccount)
            assert.equal(balanceReceive.toNumber(), 10, 'adds the amount from the receiving account')

            const allowance = await tokenInstance.allowance(fromAccount, spendingAccount)
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance')
        })
    })




});