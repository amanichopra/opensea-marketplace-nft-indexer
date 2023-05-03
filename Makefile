# GLOBAL VARIABLES
SLUG_NAME = "seaport-indexer"
SUBGRAPH_NAME = "seaportindexer"
CONTRACT_ADDRESS = "0x00000000006c3852cbef3e08e8df289169ede581" # seaport exchange
PROTOCOL = "ethereum"
START_BLOCK = "14946565"
NETWORK = "mainnet"
DEPLOY_KEY = "e6f6e8d1260e7c03834c1e5bb25eebad"
VERSION = "2.0.0"

# Only need to run this once when defining the subgraph
init:
	graph init ${SLUG_NAME} \
	--contract-name SeaportExchange \
	--index-events \
	--studio \
	--abi ./abis/SeaportExchange.json \
	--from-contract ${CONTRACT_ADDRESS} \
	--protocol ${PROTOCOL} \
	--start-block ${START_BLOCK} \
	--network ${NETWORK}

	graph add --abi ./abis/ERC165.json
	graph add --abi ./abis/NFTMetadata.json


# This needs to be run any time the graphQL schema is updated
# to ensure the event types defined in the generated code is updated 
# to match the schema. More is described in this discord thread: 
# https://discord.com/channels/438038660412342282/438070183794573313/1100527424711700521
# and under the "Code Generation" heading here:
# https://thegraph.com/docs/en/developing/creating-a-subgraph/.
update-event-classes:
	cd ${SLUG_NAME}; \
	graph codegen

# Authenticates and deploys local subgraph to a graph node.
deploy:
	graph auth ${DEPLOY_KEY} --studio \

	cd ${SLUG_NAME}; \
	graph deploy ${SUBGRAPH_NAME} \
	--version-label ${VERSION} \
	--studio;
