//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract InPersonTicketNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // TODO: DaoTicketAddress is just a place holder for now!
    address DaoTicketAddress = 0x78000b0605E81ea9df54b33f72ebC61B5F5c8077;
    constructor() ERC721("InPersonTicketNFT", "NFT") {}
    event NftEvent(uint256 tokenId, string tokenURI);
    function mintNFT(address recipient)
        public onlyOwner
        returns (uint256)
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