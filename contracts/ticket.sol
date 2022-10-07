// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Ticket is Ownable {
    using SafeERC20 for IERC20;
    IERC20 public ohm;
    IERC20 public usdt;
    IERC20 public usdc;
    IERC20 public frax;
    mapping (string => uint) public usdTicketPrices;
    mapping (string => uint) public ohmTicketPrices;
    string[] public ticketTypes;
    // token = MyToken's contract address
    constructor() {
        ohm = IERC20(0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5);
        usdt = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
        usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
        frax = IERC20(0x853d955aCEf822Db058eb8505911ED77F175b99e);
    }

    // Modifier to check token allowance
    modifier checkAllowance(address _tokenAddr, string memory ticketName, bool isStableCoin) {
        uint256 tokenPrice = getTicketPrice(ticketName, isStableCoin);
        IERC20 _token;
        if( _tokenAddr == 0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5) {
            _token = ohm;
        } else if(_tokenAddr == 0xdAC17F958D2ee523a2206206994597C13D831ec7){
            _token = usdt ;
        } else if(_tokenAddr == 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48){
            _token = usdc ;
        } else if(_tokenAddr == 0x853d955aCEf822Db058eb8505911ED77F175b99e){
            _token = frax ;
        }
        require(_token.allowance(msg.sender, address(this)) >= tokenPrice, "Error");
        _;
    }

    function getTicketPrice(string memory ticketName, bool isStableCoin) public view returns (uint) {
        if (isStableCoin == true){
            return usdTicketPrices[ticketName];
        }
        return ohmTicketPrices[ticketName];
    }
    
    function setTicketPrice(string memory ticketName, bool isStableCoin, uint ticketPrice) public onlyOwner {
        if (isStableCoin == true){
            usdTicketPrices[ticketName] = ticketPrice;
        }
        ohmTicketPrices[ticketName] = ticketPrice;
    }

    function buyTicket(address _tokenAddr, string memory ticketName, bool isStableCoin) public checkAllowance(_tokenAddr, ticketName, isStableCoin) {
        IERC20 token = IERC20(_tokenAddr);
        uint256 tokenPrice = getTicketPrice(ticketName, isStableCoin);
        token.safeTransferFrom(msg.sender, address(this), tokenPrice);
    }
    
    function withdrawToken() external onlyOwner {
        // multi-sig: Gnosis wallet address
        uint256 ohmBalance = ohm.balanceOf(address(this));
        uint256 usdtBalance = usdt.balanceOf(address(this));
        uint256 usdcBalance = usdc.balanceOf(address(this));
        uint256 fraxBalance = frax.balanceOf(address(this));
        address gnosisMultiSig = 0x7EE54ab0f204bb3A83DF90fDd824D8b4abE93222;
        ohm.safeTransfer(gnosisMultiSig, ohmBalance);
        usdt.safeTransfer(gnosisMultiSig, usdtBalance);
        usdc.safeTransfer(gnosisMultiSig, usdcBalance);
        frax.safeTransfer(gnosisMultiSig, fraxBalance);
    }
}