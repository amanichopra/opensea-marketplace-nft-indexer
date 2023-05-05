# OpenSea Marketplace Indexer

This repo contains the code behind the subgraph deployed [here](https://api.studio.thegraph.com/proxy/46323/opensea-marketplace-indexer/4.1.0/graphql?query=%0A++++%23%0A++++%23+Welcome+to+The+GraphiQL%0A++++%23%0A++++%23+GraphiQL+is+an+in-browser+tool+for+writing%2C+validating%2C+and%0A++++%23+testing+GraphQL+queries.%0A++++%23%0A++++%23+Type+queries+into+this+side+of+the+screen%2C+and+you+will+see+intelligent%0A++++%23+typeaheads+aware+of+the+current+GraphQL+type+schema+and+live+syntax+and%0A++++%23+validation+errors+highlighted+within+the+text.%0A++++%23%0A++++%23+GraphQL+queries+typically+start+with+a+%22%7B%22+character.+Lines+that+start%0A++++%23+with+a+%23+are+ignored.%0A++++%23%0A++++%23+An+example+GraphQL+query+might+look+like%3A%0A++++%23%0A++++%23+++++%7B%0A++++%23+++++++field%28arg%3A+%22value%22%29+%7B%0A++++%23+++++++++subField%0A++++%23+++++++%7D%0A++++%23+++++%7D%0A++++%23%0A++++%23+Keyboard+shortcuts%3A%0A++++%23%0A++++%23++Prettify+Query%3A++Shift-Ctrl-P+%28or+press+the+prettify+button+above%29%0A++++%23%0A++++%23+++++Merge+Query%3A++Shift-Ctrl-M+%28or+press+the+merge+button+above%29%0A++++%23%0A++++%23+++++++Run+Query%3A++Ctrl-Enter+%28or+press+the+play+button+above%29%0A++++%23%0A++++%23+++Auto+Complete%3A++Ctrl-Space+%28or+just+start+typing%29%0A++++%23%0A++) that allows querying the OpenSea Marketplace.

## Code Structure
1. `./abis/' contain the ABIs needed to interact with the smart contract [here](https://etherscan.io/address/0x00000000006c3852cbef3e08e8df289169ede581). These were extracted from Etherscan directly.
2. `./contracts/` contain the smart contracts deployed to the mainnet. They were pulled from Etherscan [here](https://etherscan.io/address/0x00000000006c3852cbef3e08e8df289169ede581#code). These allow understanding the event types that are emitted by the smart contract better so that our subgraph can listen for them. They are not directly needed for subgraph deployment.
3. `./opensea-marketplace-indexer/` contains the code relavent to the subgraph and event handlers.
4. `Makefile` defines targets to run The Graph CLI commands (init, codegen, deploy) reproducibly.

## Deploying the Subgraph
1. Run `yarn install` to install the package dependencies. This will create a folder called `./opensea-marketplace-indexer/node_modules/` that is needed to run tests and build the graph.
2. Run `graph codegen` in `./opensea-marketplace-indexer/` to create generated code that maps the graphQL schema to typescript objects that the event handlers can access.
3. Run `make deploy` from the root directory of this project to get access to the new endpoint URL. Ensure to set a deployment key and change the version number in the makefile. You can create a deployment key by initializing a subgraph on The Graph Studio by following [these](https://thegraph.com/docs/en/deploying/subgraph-studio/) instructions.

## Event Handlers
The Seaport smart contract emits several [events/errors](https://docs.opensea.io/reference/seaport-events-and-errors) that the subgraph can listen for:
- OrderFulfilled
- OrderCancelled
- OrderValidated
- CounterIncremented
- OrdersMatched
- OrderAlreadyFilled
- InvalidTime
- InvalidConduit
- MissingOriginalConsiderationItems
- InvalidCalltoConduit
- ConsiderationNotMet
- InsufficientEtherSupplied
- and more...

`OrderFulfilled` is the main event we need to listen for in the subgraph (as the `./opensea-marketplace-indexer/subgraph.yaml` shows) since it represents the successful transfer of an NFT. The main event handler we implement is for `OrderFulfilled` (code in `./opensea-marketplace-indexer/src/mapping.ts`). The key to understanding an order is that is contains an offer and consideration. The offer and considerations are simply lists of NFTs or money. If the offer only has one item which is money, that implies the consideration must contain the NFTs. This represents the offerrer being the buyer and the recipient being the seller. On the flip side, if the offer contains NFTs, then the consideration must contain money, which implies the offerrer is the seller and the recipient is the buyer. This idea was inspired by the subgraph developed by Messari shown [here](https://thegraph.com/explorer/subgraphs/G1F2huam7aLSd2JYjxnofXmqkQjT5K2fRjdfapwiik9c?view=Indexers&chain=mainnet). Because the blockchain space is decentralized and open-source, we leveraged the code used by Messari and made sure to understand the logic of the event handlers by producing detailed comments, refractored the code, and deployed our own subgraph.
