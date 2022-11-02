// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InPersonTicketNFT.sol";

contract Ticket is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public gohm;
    IERC20 public usdc;
    IERC20 public frax;
    IERC20 public dai;
    mapping (string => uint) public usdTicketPrices;
    mapping (string => uint) public gohmTicketPrices;
    string[] public ticketTypes;
    address public gnosisMultiSigAddr;
    address public inPersonTicketNFTAddr;
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event WithdrawFundTo(address indexed gnosisMultiSigAddr, uint256 tokenIdx, uint256 tokenBalance);

    constructor(address multisig, address nftAddr, address gohmAddr, address usdcAddr, address fraxAddr, address daiAddr) {
        gohm = IERC20(gohmAddr);
        usdc = IERC20(usdcAddr);
        frax = IERC20(fraxAddr);
        dai = IERC20(daiAddr);
        gnosisMultiSigAddr = multisig;
        inPersonTicketNFTAddr = nftAddr;
    }

    // Modifier to check token allowance
    modifier checkAllowance(string memory tokenName, string memory ticketName, bool isStableCoin) {
        uint256 tokenPrice = _getTicketPrice(tokenName, ticketName, isStableCoin);
        IERC20 _token = _getTokenIERCbyName(tokenName);
        emit Approval(msg.sender, address(this), tokenPrice);
        require(_token.allowance(msg.sender, address(this)) >= tokenPrice, "Error");
        _;
    }

    
    function setTicketPrice(string memory ticketName, bool isStableCoin, uint ticketPrice) public onlyOwner {
        if (isStableCoin == true){
            usdTicketPrices[ticketName] = ticketPrice;
        }
        gohmTicketPrices[ticketName] = ticketPrice;
    }

    function setInPersonTicketNFTAddr(address addr) public onlyOwner {
        inPersonTicketNFTAddr = addr;
    }

    function buyTicket(string memory tokenName, string memory ticketName, bool isStableCoin) public checkAllowance(tokenName, ticketName, isStableCoin) {
        uint256 tokenPrice = _getTicketPrice(tokenName, ticketName, isStableCoin);
        IERC20 token = _getTokenIERCbyName(tokenName);
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), tokenPrice);
        InPersonTicketNFT(inPersonTicketNFTAddr).mintNFT(msg.sender);
    }
    
    function withdrawToken() external onlyOwner {
        // multi-sig: Gnosis wallet address
        IERC20[4] memory tokenArray = [gohm, usdc, frax, dai];
        for (uint idx=0; idx<tokenArray.length; idx++) {
            uint256 tokenBalance = tokenArray[idx].balanceOf(address(this));
            if (tokenBalance != 0){
                tokenArray[idx].safeTransfer(gnosisMultiSigAddr, tokenBalance);
                emit WithdrawFundTo(gnosisMultiSigAddr, idx, tokenBalance);
            }
        }
    }

    function _getTokenIERCbyName(string memory tokenName) private view returns (IERC20){
        if(keccak256(abi.encodePacked("gohm")) == keccak256(abi.encodePacked(tokenName))) {
            return gohm;
        } else if(keccak256(abi.encodePacked("usdc")) == keccak256(abi.encodePacked(tokenName))){
            return usdc ;
        } else if(keccak256(abi.encodePacked("frax")) == keccak256(abi.encodePacked(tokenName))){
            return frax ;
        } else if(keccak256(abi.encodePacked("dai")) == keccak256(abi.encodePacked(tokenName))){
            return dai ;
        }
        revert("Invalid tokenName, it should be one of gohm, usdt, usdc, frax, dai");
    }

    function _getTicketPrice(string memory tokenName, string memory ticketName, bool isStableCoin) private view returns (uint) {
        if (isStableCoin == true){
            return usdTicketPrices[ticketName] * 10 ** _getTokenDecimals(tokenName);
        }
        return gohmTicketPrices[ticketName] * 10 ** _getTokenDecimals(tokenName);
    }

    function _getTokenDecimals(string memory tokenName) private pure returns (uint) {
        if(keccak256(abi.encodePacked("gohm")) == keccak256(abi.encodePacked(tokenName))) {
            return 9;
        } else if(keccak256(abi.encodePacked("usdc")) == keccak256(abi.encodePacked(tokenName))){
            return 6 ;
        } else if(keccak256(abi.encodePacked("frax")) == keccak256(abi.encodePacked(tokenName))){
            return 18 ;
        } else if(keccak256(abi.encodePacked("dai")) == keccak256(abi.encodePacked(tokenName))){
            return 18 ;
        }
        revert("token Address not found!");
    }
}