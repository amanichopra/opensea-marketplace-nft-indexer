import { Address, BigDecimal, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { describe, test, newMockEvent, clearStore, assert, beforeAll, beforeEach, afterAll, newTypedMockEvent, createMockedFunction } from "matchstick-as/assembly/index"

import { handleOrderFulfilled, getCollection, getMarketplace, getOrCreateCollectionDailySnapshot, getOrCreateMarketplaceDailySnapshot, getNftStandard, getTransferDetails, extractMoneyFromConsideration, extractNFTsFromOffer, extractNFTsFromConsideration, extractOpenSeaRoyaltyFees, Money, NFTs, Fees, Sale } from "../src/handler"
import { OrderFulfilledConsiderationStruct, OrderFulfilledOfferStruct } from "../generated/Seaport/Seaport";
import { BIGDECIMAL_MAX, BIGDECIMAL_ZERO, BIGINT_ZERO, NFTStandards, OPENSEA_FEES_ACCOUNT, SECONDS_PER_DAY, SaleStrategies, SeaportItemType } from "../src/utils";

import { store } from "@graphprotocol/graph-ts"
import { CollectionDailySnapshot, Marketplace, MarketplaceDailySnapshot } from "../generated/schema";
import { NetworkConfigs } from "../configurations/configure";

const DUMMY_ADDRESS = "0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b"
const DUMMY_ADDRESS2 = "0x388c818ca8b9251b393131c08a736a67ccb19297"

// describe("handleOrdersMatched()", () => {
//     describe("When receipt is present", () => {
//         test("updates the entity", () => {

//         })
//     })

//     describe("When receipt is not present", () => {
//         test("it creates a new entity", () => {

//         })
//     })
// })

describe("getMarketplace()", () => {
    describe("When marketplace does not exist", () => {
        test("it returns new market place", () => {
            const marketplaceID = "marketplaceID"
            const marketplace = store.get("Marketplace", marketplaceID)
            assert.assertNull(marketplace)

            const retVal = getMarketplace(marketplaceID)
            const expected = store.get("Marketplace", marketplaceID)
            assert.assertTrue(expected!.get("id")!.toString() == retVal.id)
            assert.assertTrue(expected!.get("collectionCount")!.toI32() == retVal.collectionCount)
            assert.assertTrue(expected!.get("totalRevenueETH")!.toBigDecimal() == retVal.totalRevenueETH)
        })
    })

    describe("When marketplace exists", () => {
        test("it loads existing marketplace", () => {
            const marketplaceID = "marketplaceID"
            const existingMarketplace = new Marketplace(marketplaceID)
            existingMarketplace.name = NetworkConfigs.getProtocolName();
            existingMarketplace.slug = NetworkConfigs.getProtocolSlug();
            existingMarketplace.network = NetworkConfigs.getNetwork();
            existingMarketplace.schemaVersion = NetworkConfigs.getSchemaVersion();
            existingMarketplace.subgraphVersion = NetworkConfigs.getSubgraphVersion();
            existingMarketplace.methodologyVersion = NetworkConfigs.getMethodologyVersion();
            existingMarketplace.collectionCount = 1;
            existingMarketplace.tradeCount = 0;
            existingMarketplace.cumulativeTradeVolumeETH = BIGDECIMAL_ZERO;
            existingMarketplace.marketplaceRevenueETH = BIGDECIMAL_ZERO;
            existingMarketplace.creatorRevenueETH = BIGDECIMAL_ZERO;
            existingMarketplace.totalRevenueETH = BigDecimal.fromString("1.2");
            existingMarketplace.cumulativeUniqueTraders = 0;
            store.set("Marketplace", marketplaceID, existingMarketplace)
            
            const marketplace = store.get("Marketplace", marketplaceID)
            assert.assertNotNull(marketplace)

            const retVal = getMarketplace(marketplaceID)
            assert.assertTrue(retVal.id == existingMarketplace.id)
            assert.assertTrue(retVal.collectionCount == existingMarketplace.collectionCount)
            assert.assertTrue(retVal.totalRevenueETH == existingMarketplace.totalRevenueETH)
        })
    })
})

describe("getOrCreateMarketplaceDailySnapshot()", () => {
    describe("When market daily snapshot does not exist", () => {
        test("it returns new market daily snapshot place", () => {
            const timestamp = BigInt.fromU32(1)
            const snapshotID = (timestamp.toI32() / SECONDS_PER_DAY).toString();
            const snapshot = store.get("MarketplaceDailySnapshot", snapshotID)
            assert.assertNull(snapshot)

            const retVal = getOrCreateMarketplaceDailySnapshot(timestamp)
            const expected = store.get("MarketplaceDailySnapshot", snapshotID)
            assert.assertTrue(expected!.get("id")!.toString() == retVal.id)
            assert.assertTrue(expected!.get("collectionCount")!.toI32() == retVal.collectionCount)
            assert.assertTrue(expected!.get("blockNumber")!.toBigInt() == retVal.blockNumber)
            assert.assertTrue(expected!.get("tradeCount")!.toI32() == retVal.tradeCount)
        })
    })

    describe("When market daily snapshot exists", () => {
        test("it loads market daily snapshot marketplace", () => {
            const timestamp = BigInt.fromU32(1)
            const snapshotID = (timestamp.toI32() / SECONDS_PER_DAY).toString();
            const existingSnapshot = new MarketplaceDailySnapshot(snapshotID)
            existingSnapshot.marketplace = NetworkConfigs.getMarketplaceAddress();
            existingSnapshot.blockNumber = BIGINT_ZERO;
            existingSnapshot.timestamp = BIGINT_ZERO;
            existingSnapshot.collectionCount = 0;
            existingSnapshot.cumulativeTradeVolumeETH = BIGDECIMAL_ZERO;
            existingSnapshot.marketplaceRevenueETH = BIGDECIMAL_ZERO;
            existingSnapshot.creatorRevenueETH = BIGDECIMAL_ZERO;
            existingSnapshot.totalRevenueETH = BIGDECIMAL_ZERO;
            existingSnapshot.tradeCount = 0;
            existingSnapshot.cumulativeUniqueTraders = 0;
            existingSnapshot.dailyTradedItemCount = 0;
            existingSnapshot.dailyActiveTraders = 0;
            existingSnapshot.dailyTradedCollectionCount = 0;
            store.set("MarketplaceDailySnapshot", snapshotID, existingSnapshot)
            
            const snapshot = store.get("MarketplaceDailySnapshot", snapshotID)
            assert.assertNotNull(snapshot)

            const retVal = getOrCreateMarketplaceDailySnapshot(timestamp)
            assert.assertTrue(retVal.id == existingSnapshot.id)
            assert.assertTrue(retVal.collectionCount == existingSnapshot.collectionCount)
            assert.assertTrue(retVal.blockNumber == existingSnapshot.blockNumber)
            assert.assertTrue(retVal.tradeCount == existingSnapshot.tradeCount)
        })
    })
})

describe("getOrCreateCollectionDailySnapshot()", () => {
    describe("When collection daily snapshot does not exist", () => {
        test("it returns new collection daily snapshot place", () => {
            const collection = "collection"
            const timestamp = BigInt.fromU32(1)
            const snapshotID = collection.concat("-").concat((timestamp.toI32() / SECONDS_PER_DAY).toString());
            const snapshot = store.get("CollectionDailySnapshot", snapshotID)
            assert.assertNull(snapshot)

            const retVal = getOrCreateCollectionDailySnapshot(collection, timestamp)
            const expected = store.get("CollectionDailySnapshot", snapshotID)
            assert.assertTrue(expected!.get("id")!.toString() == retVal.id)
            assert.assertTrue(expected!.get("collection")!.toString() == retVal.collection)
            assert.assertTrue(expected!.get("blockNumber")!.toBigInt() == retVal.blockNumber)
            assert.assertTrue(expected!.get("tradeCount")!.toI32() == retVal.tradeCount)
        })
    })

    describe("When collection daily snapshot exists", () => {
        test("it loads collection daily snapshot marketplace", () => {
            const collection = "collection"
            const timestamp = BigInt.fromU32(1)
            const snapshotID = collection.concat("-").concat((timestamp.toI32() / SECONDS_PER_DAY).toString());
            const existingSnapshot = new CollectionDailySnapshot(snapshotID)
            existingSnapshot.collection = collection;
            existingSnapshot.blockNumber = BIGINT_ZERO;
            existingSnapshot.timestamp = BIGINT_ZERO;
            existingSnapshot.royaltyFee = BIGDECIMAL_ZERO;
            existingSnapshot.dailyMinSalePrice = BIGDECIMAL_MAX;
            existingSnapshot.dailyMaxSalePrice = BIGDECIMAL_ZERO;
            existingSnapshot.cumulativeTradeVolumeETH = BIGDECIMAL_ZERO;
            existingSnapshot.dailyTradeVolumeETH = BIGDECIMAL_ZERO;
            existingSnapshot.marketplaceRevenueETH = BIGDECIMAL_ZERO;
            existingSnapshot.creatorRevenueETH = BIGDECIMAL_ZERO;
            existingSnapshot.totalRevenueETH = BIGDECIMAL_ZERO;
            existingSnapshot.tradeCount = 0;
            existingSnapshot.dailyTradedItemCount = 0;
            store.set("CollectionDailySnapshot", snapshotID, existingSnapshot)
            
            const snapshot = store.get("CollectionDailySnapshot", snapshotID)
            assert.assertNotNull(snapshot)

            const retVal = getOrCreateCollectionDailySnapshot(collection, timestamp)
            assert.assertTrue(retVal.id == existingSnapshot.id)
            assert.assertTrue(retVal.collection == existingSnapshot.collection)
            assert.assertTrue(retVal.blockNumber == existingSnapshot.blockNumber)
            assert.assertTrue(retVal.tradeCount == existingSnapshot.tradeCount)
        })
    })
})

// describe("getNftStandard()", () => {
//     describe("When receipt is present", () => {
//         test("updates the entity", () => {

//         })
//     })

//     describe("When receipt is not present", () => {
//         test("it creates a new entity", () => {

//         })
//     })
// })

describe("getTransferDetails()", () => {
    describe("when offer is empty", () => {
        test("it returns null", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offer: OrderFulfilledOfferStruct[] = []

            const considerationTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(considerationTupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when consideration is empty", () => {
        test("it returns null", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offerTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(offerTupleArray)
            const offer = [
                offerItem
            ]

            const consideration: OrderFulfilledConsiderationStruct[] = []

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when offer and consideration are present, offer is money, and consideration is not NFT", () => {
        test("it returns null", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offerTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(offerTupleArray)
            const offer = [
                offerItem
            ]

            const considerationTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.ERC20),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(considerationTupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when offer and consideration are present, offer is money, and consideration is NFT", () => {
        test("it returns a sale with offerer as buyer and recipient as seller", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offerTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(offerTupleArray)
            const offer = [
                offerItem
            ]

            const considerationTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(considerationTupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertTrue(retVal!.buyer == offerer)
            assert.assertTrue(retVal!.seller == recipient)
            assert.assertTrue(retVal!.money.amount == BigInt.fromU32(10))
        })
    })

    describe("when offer and consideration are present, offer is non-money, and consideration is non-money", () => {
        test("it returns null", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offerTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.ERC1155),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(offerTupleArray)
            const offer = [
                offerItem
            ]

            const considerationTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(considerationTupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when offer and consideration are present, offer is non-NFTs, and consideration is money", () => {
        test("it returns null", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offerTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(offerTupleArray)
            const offer = [
                offerItem
            ]

            const considerationTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(considerationTupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when offer and consideration are present, offer is NFTs, and consideration is money", () => {
        test("it returns a sale with offerer as seller and recipient as buyer", () => {
            const offerer = Address.fromString(DUMMY_ADDRESS)
            const recipient = Address.fromString(DUMMY_ADDRESS2)
            
            const offerTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(offerTupleArray)
            const offer = [
                offerItem
            ]

            const considerationTupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(20)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(considerationTupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = getTransferDetails(offerer, recipient, offer, consideration)
            assert.assertTrue(retVal!.buyer == recipient)
            assert.assertTrue(retVal!.seller == offerer)
            assert.assertTrue(retVal!.money.amount == BigInt.fromU32(20))
        })
    })
})

describe("extractMoneyFromConsideration()", () => {
    describe("when all money in consideration sums to zero", () => {
        test("it returns null", () => {
            const tupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(tupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = extractMoneyFromConsideration(consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when all money in consideration sums to non-zero", () => {
        test("it returns correct money amount", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC20),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(90)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractMoneyFromConsideration(consideration)
            assert.bigIntEquals(retVal!.amount!, BigInt.fromU32(100))
        })
    })

    describe("when consideration is all non-money", () => {
        test("it returns null", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC1155),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const consideration = [
                considerationItem1,
            ]

            const retVal = extractMoneyFromConsideration(consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when consideration is partially money and partially non-money and sums to zero", () => {
        test("it returns null", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721_WITH_CRITERIA),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(90)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractMoneyFromConsideration(consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when consideration is partially money and partially non-money and sums to non-zero", () => {
        test("it returns sum of money consideration items only", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721_WITH_CRITERIA),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(90)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractMoneyFromConsideration(consideration)
            assert.bigIntEquals(retVal!.amount!, BigInt.fromU32(10))
        })
    })
})

describe("extractNFTsFromOffer()", () => {
    describe("when all offer items are non-NFTs", () => {
        test("it returns null", () => {
            const tupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
            ]
            const offerItem = changetype<OrderFulfilledOfferStruct>(tupleArray)
            const offer = [
                offerItem
            ]

            const retVal = extractNFTsFromOffer(offer)
            assert.assertNull(retVal)
        })
    })

    describe("when offer contains multiple NFTs and are different tokens", () => {
        test("it returns null", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
            ]
            const offerItem1 = changetype<OrderFulfilledOfferStruct>(tupleArray1)
            const offerItem2 = changetype<OrderFulfilledOfferStruct>(tupleArray2)
            const offer = [
                offerItem1,
                offerItem2
            ]

            const retVal = extractNFTsFromOffer(offer)
            assert.assertNull(retVal)
        })
    })

    describe("when offer contains multiple NFTs and are same tokens that are ERC721", () => {
        test("it returns an ERC721 NFTs collection", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const offerItem1 = changetype<OrderFulfilledOfferStruct>(tupleArray1)
            const offerItem2 = changetype<OrderFulfilledOfferStruct>(tupleArray2)
            const offer = [
                offerItem1,
                offerItem2
            ]

            const retVal = extractNFTsFromOffer(offer)
            const expected = new NFTs(Address.fromString(DUMMY_ADDRESS), NFTStandards.ERC721, [BigInt.fromU32(1), BigInt.fromU32(1)], [BigInt.fromU32(10), BigInt.fromU32(10)])

            assert.assertTrue(retVal!.tokenAddress == expected.tokenAddress)
            assert.assertTrue(retVal!.standard == expected.standard)
            
            assert.assertTrue(retVal!.tokenIds.length == 2)
            assert.assertTrue(retVal!.tokenIds[0] == BigInt.fromU32(1))
            assert.assertTrue(retVal!.tokenIds[1] == BigInt.fromU32(1))
            
            assert.assertTrue(retVal!.amounts.length == 2)
            assert.assertTrue(retVal!.amounts[0] == BigInt.fromU32(10))
            assert.assertTrue(retVal!.amounts[1] == BigInt.fromU32(10))
        })
    })

    describe("when offer contains multiple NFTs and are same tokens that are ERC1155", () => {
        test("it returns an ERC1155 NFTs collection", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC1155),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC1155),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const offerItem1 = changetype<OrderFulfilledOfferStruct>(tupleArray1)
            const offerItem2 = changetype<OrderFulfilledOfferStruct>(tupleArray2)
            const offer = [
                offerItem1,
                offerItem2
            ]

            const retVal = extractNFTsFromOffer(offer)
            const expected = new NFTs(Address.fromString(DUMMY_ADDRESS), NFTStandards.ERC1155, [BigInt.fromU32(1), BigInt.fromU32(1)], [BigInt.fromU32(10), BigInt.fromU32(10)])

            assert.assertTrue(retVal!.tokenAddress == expected.tokenAddress)
            assert.assertTrue(retVal!.standard == expected.standard)
            
            assert.assertTrue(retVal!.tokenIds.length == 2)
            assert.assertTrue(retVal!.tokenIds[0] == BigInt.fromU32(1))
            assert.assertTrue(retVal!.tokenIds[1] == BigInt.fromU32(1))
            
            assert.assertTrue(retVal!.amounts.length == 2)
            assert.assertTrue(retVal!.amounts[0] == BigInt.fromU32(10))
            assert.assertTrue(retVal!.amounts[1] == BigInt.fromU32(10))
        })
    })
})

describe("extractNFTsFromConsideration()", () => {
    describe("when all consideration items are non-NFTs", () => {
        test("it returns null", () => {
            const tupleArray = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem = changetype<OrderFulfilledConsiderationStruct>(tupleArray)
            const consideration = [
                considerationItem
            ]

            const retVal = extractNFTsFromConsideration(consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when consideration contains multiple NFTs and are different tokens", () => {
        test("it returns null", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS2)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractNFTsFromConsideration(consideration)
            assert.assertNull(retVal)
        })
    })

    describe("when consideration contains multiple NFTs and are same tokens that are ERC721", () => {
        test("it returns an ERC721 NFTs collection", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC721),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractNFTsFromConsideration(consideration)
            const expected = new NFTs(Address.fromString(DUMMY_ADDRESS), NFTStandards.ERC721, [BigInt.fromU32(1), BigInt.fromU32(1)], [BigInt.fromU32(10), BigInt.fromU32(10)])

            assert.assertTrue(retVal!.tokenAddress == expected.tokenAddress)
            assert.assertTrue(retVal!.standard == expected.standard)
            
            assert.assertTrue(retVal!.tokenIds.length == 2)
            assert.assertTrue(retVal!.tokenIds[0] == BigInt.fromU32(1))
            assert.assertTrue(retVal!.tokenIds[1] == BigInt.fromU32(1))
            
            assert.assertTrue(retVal!.amounts.length == 2)
            assert.assertTrue(retVal!.amounts[0] == BigInt.fromU32(10))
            assert.assertTrue(retVal!.amounts[1] == BigInt.fromU32(10))
        })
    })

    describe("when consideration contains multiple NFTs and are same tokens that are ERC1155", () => {
        test("it returns an ERC1155 NFTs collection", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.ERC1155),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.ERC1155),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractNFTsFromConsideration(consideration)
            const expected = new NFTs(Address.fromString(DUMMY_ADDRESS), NFTStandards.ERC1155, [BigInt.fromU32(1), BigInt.fromU32(1)], [BigInt.fromU32(10), BigInt.fromU32(10)])

            assert.assertTrue(retVal!.tokenAddress == expected.tokenAddress)
            assert.assertTrue(retVal!.standard == expected.standard)
            
            assert.assertTrue(retVal!.tokenIds.length == 2)
            assert.assertTrue(retVal!.tokenIds[0] == BigInt.fromU32(1))
            assert.assertTrue(retVal!.tokenIds[1] == BigInt.fromU32(1))
            
            assert.assertTrue(retVal!.amounts.length == 2)
            assert.assertTrue(retVal!.amounts[0] == BigInt.fromU32(10))
            assert.assertTrue(retVal!.amounts[1] == BigInt.fromU32(10))
        })
    })
})

describe("extractOpenSeaRoyaltyFees()", () => {
    describe("when consideration does not have open sea fee account recipient and has only excluded recipient items", () => {
        test("it returns zero fees", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractOpenSeaRoyaltyFees(Address.fromString(DUMMY_ADDRESS), consideration)
            assert.assertTrue(retVal.protocolRevenue == BIGINT_ZERO)
            assert.assertTrue(retVal.creatorRevenue == BIGINT_ZERO)
        })
    })

    describe("when consideration does have open sea fee account recipient and has only excluded recipient items", () => {
        test("it returns non-zero protocol fees and zero royalty fees", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(OPENSEA_FEES_ACCOUNT),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractOpenSeaRoyaltyFees(Address.fromString(DUMMY_ADDRESS), consideration)
            assert.assertTrue(retVal.protocolRevenue == BigInt.fromU32(10))
            assert.assertTrue(retVal.creatorRevenue == BIGINT_ZERO)
        })
    })

    describe("when consideration does not have open sea fee account recipient and has non-excluded recipient items", () => {
        test("it returns zero protocol fees and non-zero royalty fees", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(0)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractOpenSeaRoyaltyFees(Address.fromString(DUMMY_ADDRESS2), consideration)
            assert.assertTrue(retVal.protocolRevenue == BIGINT_ZERO)
            assert.assertTrue(retVal.creatorRevenue == BigInt.fromU32(10))
        })
    })

    describe("when consideration does have open sea fee account recipient and has non-excluded recipient items", () => {
        test("it returns non-zero protocol fees and non-zero royalty fees", () => {
            const tupleArray1 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(10)),
                ethereum.Value.fromAddress(OPENSEA_FEES_ACCOUNT),
            ]
            const tupleArray2 = [
                ethereum.Value.fromI32(SeaportItemType.NATIVE),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(1)),
                ethereum.Value.fromUnsignedBigInt(BigInt.fromU32(50)),
                ethereum.Value.fromAddress(Address.fromString(DUMMY_ADDRESS)),
            ]
            const considerationItem1 = changetype<OrderFulfilledConsiderationStruct>(tupleArray1)
            const considerationItem2 = changetype<OrderFulfilledConsiderationStruct>(tupleArray2)
            const consideration = [
                considerationItem1,
                considerationItem2
            ]

            const retVal = extractOpenSeaRoyaltyFees(Address.fromString(DUMMY_ADDRESS2), consideration)
            assert.assertTrue(retVal.protocolRevenue == BigInt.fromU32(10))
            assert.assertTrue(retVal.creatorRevenue == BigInt.fromU32(50))
        })
    })
})