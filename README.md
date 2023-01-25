# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
npx hardhat node 
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## Local Development

1. `npx hardhat  run scripts/deploy_tokens.js --network localhost`
2. Put the local token addresses into [./scripts/deploy_ticket.js](./scripts/deploy_ticket.js) and do not commit
3. `npx hardhat  run scripts/deploy_ticket.js --network localhost`