import { Address, BigDecimal, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import { describe, test, newMockEvent, clearStore, assert, beforeAll, beforeEach, afterAll, newTypedMockEvent, createMockedFunction } from "matchstick-as/assembly/index"

import { handleOrderFulfilled, getCollection, getMarketplace, getOrCreateCollectionDailySnapshot, getOrCreateMarketplaceDailySnapshot, getNftStandard, getTransferDetails, extractMoneyFromConsideration, extractNFTsFromOffer, extractNFTsFromConsideration, extractOpenSeaRoyaltyFees, Money, NFTs } from "../src/handler"
import { OrderFulfilledConsiderationStruct, OrderFulfilledOfferStruct } from "../generated/Seaport/Seaport";
import { NFTStandards, SeaportItemType } from "../src/utils";

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

// describe("getOrCreateCollection()", () => {
//     describe("When receipt is present", () => {
//         test("updates the entity", () => {

//         })
//     })

//     describe("When receipt is not present", () => {
//         test("it creates a new entity", () => {

//         })
//     })
// })

// describe("getOrCreateMarketplace()", () => {
//     describe("When receipt is present", () => {
//         test("updates the entity", () => {

//         })
//     })

//     describe("When receipt is not present", () => {
//         test("it creates a new entity", () => {

//         })
//     })
// })

// describe("getOrCreateCollectionDailySnapshot()", () => {
//     describe("When receipt is present", () => {
//         test("updates the entity", () => {

//         })
//     })

//     describe("When receipt is not present", () => {
//         test("it creates a new entity", () => {

//         })
//     })
// })

// describe("getOrCreateMarketplaceDailySnapshot()", () => {
//     describe("When receipt is present", () => {
//         test("updates the entity", () => {

//         })
//     })

//     describe("When receipt is not present", () => {
//         test("it creates a new entity", () => {

//         })
//     })
// })

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

// describe("getTransferDetails()", () => {
//     describe("when offer is empty", () => {
//         test("it returns null", () => {

//         })
//     })

//     describe("when consideration is empty", () => {
//         test("it returns null", () => {

//         })
//     })

//     describe("when offer is present and offer is money", () => {
//         test("it returns a sale with offerer as buyer and recipient as seller", () => {

//         })
//     })
// })

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