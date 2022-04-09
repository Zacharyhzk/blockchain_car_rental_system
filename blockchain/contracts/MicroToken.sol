// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MicroToken is IERC20 {
    string public constant symbol = "MFT";
    string public constant name = "Microfinance Token";
    uint8 public constant decimals = 0;
    uint private constant __totalSupply = 1000;
    mapping (address => uint) private __balanceOf;
    mapping (address => mapping (address => uint)) private __allowances;
    constructor() {
            __balanceOf[msg.sender] = __totalSupply;
    }
    function totalSupply() public pure override returns (uint _totalSupply) { _totalSupply = __totalSupply;
    }
    function balanceOf(address _addr) public view override returns (uint
    balance) {
        return __balanceOf[_addr];
    }
    function transfer(address _to, uint _value) public override returns (bool
    success) {
        if (_value > 0 && _value <= balanceOf(msg.sender)) {
            __balanceOf[msg.sender] -= _value;
            __balanceOf[_to] += _value;
            return true;
    }
        return false;
    }
    function transferFrom(address _from, address _to, uint _value) public override returns (bool success) {
        if (__allowances[_from][msg.sender] > 0 &&
            _value > 0 &&
            __allowances[_from][msg.sender] >= _value &&
            __balanceOf[_from] >= _value) {
            __balanceOf[_from] -= _value;
            __balanceOf[_to] += _value;
             __allowances[_from][msg.sender] -= _value;
            return true;
    }
        return false;
    }
    function approve(address _spender, uint _value) public override returns
    (bool success) {
        __allowances[msg.sender][_spender] = _value;
        return true;
    }
    function allowance(address _owner, address _spender)
        public view override returns (uint remaining) {
            return __allowances[_owner][_spender];
    }
}