// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InPersonTicketNFT.sol";

contract Ticket is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public ohm;
    address public ohmAddr;
    IERC20 public usdt;
    address public usdtAddr;
    IERC20 public usdc;
    address public usdcAddr;
    IERC20 public frax;
    address public fraxAddr;
    mapping (string => uint) public usdTicketPrices;
    mapping (string => uint) public ohmTicketPrices;
    string[] public ticketTypes;
    address public gnosisMultiSig = 0x7EE54ab0f204bb3A83DF90fDd824D8b4abE93222;
    address public InPersonTicketNFTAddr;

    // token = MyToken's contract address
    constructor() {
        ohm = IERC20(0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5);
        ohmAddr = 0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5;
        usdt = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
        usdtAddr = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
        usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        usdcAddr = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        frax = IERC20(0x853d955aCEf822Db058eb8505911ED77F175b99e);
        fraxAddr = 0x853d955aCEf822Db058eb8505911ED77F175b99e;
    }

    // Modifier to check token allowance
    modifier checkAllowance(address _tokenAddr, string memory ticketName, bool isStableCoin) {
        uint256 tokenPrice = _getTicketPrice(_tokenAddr, ticketName, isStableCoin);
        IERC20 _token;
        if( _tokenAddr == ohmAddr) {
            _token = ohm;
        } else if(_tokenAddr == usdtAddr){
            _token = usdt ;
        } else if(_tokenAddr == usdcAddr){
            _token = usdc ;
        } else if(_tokenAddr == fraxAddr){
            _token = frax ;
        }
        require(_token.allowance(msg.sender, address(this)) >= tokenPrice, "Error");
        _;
    }

    
    function setTicketPrice(string memory ticketName, bool isStableCoin, uint ticketPrice) public onlyOwner {
        if (isStableCoin == true){
            usdTicketPrices[ticketName] = ticketPrice;
        }
        ohmTicketPrices[ticketName] = ticketPrice;
    }

    function buyTicket(address _tokenAddr, string memory ticketName, bool isStableCoin) public checkAllowance(_tokenAddr, ticketName, isStableCoin) {
        IERC20 token = IERC20(_tokenAddr);
        uint256 tokenPrice = _getTicketPrice(_tokenAddr, ticketName, isStableCoin);
        token.safeTransferFrom(msg.sender, address(this), tokenPrice);
        InPersonTicketNFT(InPersonTicketNFTAddr).mintNFT(msg.sender);
    }
    
    function withdrawToken() external onlyOwner {
        // multi-sig: Gnosis wallet address
        uint256 ohmBalance = ohm.balanceOf(address(this));
        uint256 usdtBalance = usdt.balanceOf(address(this));
        uint256 usdcBalance = usdc.balanceOf(address(this));
        uint256 fraxBalance = frax.balanceOf(address(this));
        ohm.safeTransfer(gnosisMultiSig, ohmBalance);
        usdt.safeTransfer(gnosisMultiSig, usdtBalance);
        usdc.safeTransfer(gnosisMultiSig, usdcBalance);
        frax.safeTransfer(gnosisMultiSig, fraxBalance);
    }
    function _getTicketPrice(address _tokenAddr, string memory ticketName, bool isStableCoin) public view returns (uint) {
        if (isStableCoin == true){
            return usdTicketPrices[ticketName] * _getTokenDecimals(_tokenAddr);
        }
        return ohmTicketPrices[ticketName] * _getTokenDecimals(_tokenAddr);
    }

    function setInPersonTicketNFTAddr(address nftAddr) external onlyOwner {
        InPersonTicketNFTAddr = nftAddr;
    }

    function _getTokenDecimals(address _tokenAddr) public view returns (uint) {
        if (_tokenAddr == ohmAddr) {
            return 9;
        } else if (_tokenAddr == usdtAddr) {
            return 6;
        } else if (_tokenAddr == usdcAddr) {
            return 6;
        } else if (_tokenAddr == fraxAddr) {
            return 18;
        } 
        revert("token Address not found!");
    }
}