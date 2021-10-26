pragma solidity ^0.8.2;

contract BriandToken {
    string public name = "Briand Token";
    string public symbol = "BND";
    string public standard = "Briand Token v1.0";
    uint256 public totalSupply = 1000000;
    uint8 public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // function briandToken(uint256 _initialSupply) public{
    //     balanceOf[msg.sender] = _initialSupply;
    //     totalSupply = _initialSupply;

    // }

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);              //require _from has enough tokens
        require(_value <= allowance[_from][msg.sender]); //reuire allowance is big enough
        balanceOf[_from] -= _value;                      //change the balance 
        balanceOf[_to] += _value;                        //change the balance 
        allowance[_from][msg.sender] -= _value;          //update the allowance
        emit Transfer(_from, _to, _value);               //transfer event
        return true;
    }
}
