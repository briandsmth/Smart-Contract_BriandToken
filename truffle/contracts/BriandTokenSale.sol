pragma solidity ^0.8.2;
import "./BriandToken.sol";

contract BriandTokenSale {
    address admin;
    BriandToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(BriandToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == multiply(_numberOfTokens, tokenPrice));    //Require that value is equal to tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);      //Require that contract has enough tokens
        require(tokenContract.transfer(msg.sender, _numberOfTokens));   //Require that transfer is successful

        tokensSold += _numberOfTokens;  //Keep track of tokenSold

        emit Sell(msg.sender, _numberOfTokens);  //Trigger sell Event
    }

    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        // Let's not destroy the contract here
        // Just transfer the balance to the admin
        payable(admin).transfer(address(this).balance);
    }
    
}
