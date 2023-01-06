pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MockGOHM is ERC20{
    constructor() ERC20("WooCoin","WC") {
        _mint(msg.sender, 0.006 * 10 ** 18);
    }
}