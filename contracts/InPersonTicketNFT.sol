//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract InPersonTicketNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // TODO: DaoTicketAddress is just a place holder for now!
    address DaoTicketAddress;
    constructor(address addr) ERC721("InPersonTicketNFT", "NFT") {
        DaoTicketAddress = addr;
    }
    event NftEvent(uint256 tokenId, string tokenURI);
    function mintNFT(address recipient)
        public  returns (uint256)
    {
        require(msg.sender == DaoTicketAddress, "Only DAO ticket contract can mint an InPersonTicketNFT!");
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        // TODO: put a tokenURI placeholder for now!
        string memory tokenURI = "ipfs://QmNVJPswnRwHReptaBSrW81R43khRqDAdUMoZEtdnhM4mn";
        _setTokenURI(newItemId, tokenURI);
        emit NftEvent(newItemId, tokenURI);
        return newItemId;
    }
}
