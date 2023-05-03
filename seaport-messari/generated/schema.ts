// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Marketplace extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Marketplace entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Marketplace must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Marketplace", id.toString(), this);
    }
  }

  static load(id: string): Marketplace | null {
    return changetype<Marketplace | null>(store.get("Marketplace", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get slug(): string {
    let value = this.get("slug");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set slug(value: string) {
    this.set("slug", Value.fromString(value));
  }

  get network(): string {
    let value = this.get("network");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set network(value: string) {
    this.set("network", Value.fromString(value));
  }

  get schemaVersion(): string {
    let value = this.get("schemaVersion");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set schemaVersion(value: string) {
    this.set("schemaVersion", Value.fromString(value));
  }

  get subgraphVersion(): string {
    let value = this.get("subgraphVersion");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set subgraphVersion(value: string) {
    this.set("subgraphVersion", Value.fromString(value));
  }

  get methodologyVersion(): string {
    let value = this.get("methodologyVersion");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set methodologyVersion(value: string) {
    this.set("methodologyVersion", Value.fromString(value));
  }

  get collectionCount(): i32 {
    let value = this.get("collectionCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set collectionCount(value: i32) {
    this.set("collectionCount", Value.fromI32(value));
  }

  get tradeCount(): i32 {
    let value = this.get("tradeCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set tradeCount(value: i32) {
    this.set("tradeCount", Value.fromI32(value));
  }

  get cumulativeTradeVolumeETH(): BigDecimal {
    let value = this.get("cumulativeTradeVolumeETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set cumulativeTradeVolumeETH(value: BigDecimal) {
    this.set("cumulativeTradeVolumeETH", Value.fromBigDecimal(value));
  }

  get marketplaceRevenueETH(): BigDecimal {
    let value = this.get("marketplaceRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set marketplaceRevenueETH(value: BigDecimal) {
    this.set("marketplaceRevenueETH", Value.fromBigDecimal(value));
  }

  get creatorRevenueETH(): BigDecimal {
    let value = this.get("creatorRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set creatorRevenueETH(value: BigDecimal) {
    this.set("creatorRevenueETH", Value.fromBigDecimal(value));
  }

  get totalRevenueETH(): BigDecimal {
    let value = this.get("totalRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set totalRevenueETH(value: BigDecimal) {
    this.set("totalRevenueETH", Value.fromBigDecimal(value));
  }

  get cumulativeUniqueTraders(): i32 {
    let value = this.get("cumulativeUniqueTraders");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set cumulativeUniqueTraders(value: i32) {
    this.set("cumulativeUniqueTraders", Value.fromI32(value));
  }
}

export class Collection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Collection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Collection must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Collection", id.toString(), this);
    }
  }

  static load(id: string): Collection | null {
    return changetype<Collection | null>(store.get("Collection", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get symbol(): string | null {
    let value = this.get("symbol");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set symbol(value: string | null) {
    if (!value) {
      this.unset("symbol");
    } else {
      this.set("symbol", Value.fromString(<string>value));
    }
  }

  get totalSupply(): BigInt | null {
    let value = this.get("totalSupply");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set totalSupply(value: BigInt | null) {
    if (!value) {
      this.unset("totalSupply");
    } else {
      this.set("totalSupply", Value.fromBigInt(<BigInt>value));
    }
  }

  get nftStandard(): string {
    let value = this.get("nftStandard");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set nftStandard(value: string) {
    this.set("nftStandard", Value.fromString(value));
  }

  get royaltyFee(): BigDecimal {
    let value = this.get("royaltyFee");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set royaltyFee(value: BigDecimal) {
    this.set("royaltyFee", Value.fromBigDecimal(value));
  }

  get cumulativeTradeVolumeETH(): BigDecimal {
    let value = this.get("cumulativeTradeVolumeETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set cumulativeTradeVolumeETH(value: BigDecimal) {
    this.set("cumulativeTradeVolumeETH", Value.fromBigDecimal(value));
  }

  get marketplaceRevenueETH(): BigDecimal {
    let value = this.get("marketplaceRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set marketplaceRevenueETH(value: BigDecimal) {
    this.set("marketplaceRevenueETH", Value.fromBigDecimal(value));
  }

  get creatorRevenueETH(): BigDecimal {
    let value = this.get("creatorRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set creatorRevenueETH(value: BigDecimal) {
    this.set("creatorRevenueETH", Value.fromBigDecimal(value));
  }

  get totalRevenueETH(): BigDecimal {
    let value = this.get("totalRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set totalRevenueETH(value: BigDecimal) {
    this.set("totalRevenueETH", Value.fromBigDecimal(value));
  }

  get tradeCount(): i32 {
    let value = this.get("tradeCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set tradeCount(value: i32) {
    this.set("tradeCount", Value.fromI32(value));
  }

  get buyerCount(): i32 {
    let value = this.get("buyerCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set buyerCount(value: i32) {
    this.set("buyerCount", Value.fromI32(value));
  }

  get sellerCount(): i32 {
    let value = this.get("sellerCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set sellerCount(value: i32) {
    this.set("sellerCount", Value.fromI32(value));
  }

  get trades(): Array<string> {
    let value = this.get("trades");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toStringArray();
    }
  }
}

export class Trade extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Trade entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Trade must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Trade", id.toString(), this);
    }
  }

  static load(id: string): Trade | null {
    return changetype<Trade | null>(store.get("Trade", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get transactionHash(): string {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set transactionHash(value: string) {
    this.set("transactionHash", Value.fromString(value));
  }

  get logIndex(): i32 {
    let value = this.get("logIndex");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set logIndex(value: i32) {
    this.set("logIndex", Value.fromI32(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get isBundle(): boolean {
    let value = this.get("isBundle");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isBundle(value: boolean) {
    this.set("isBundle", Value.fromBoolean(value));
  }

  get collection(): string {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }

  get priceETH(): BigDecimal {
    let value = this.get("priceETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set priceETH(value: BigDecimal) {
    this.set("priceETH", Value.fromBigDecimal(value));
  }

  get strategy(): string {
    let value = this.get("strategy");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set strategy(value: string) {
    this.set("strategy", Value.fromString(value));
  }

  get buyer(): string {
    let value = this.get("buyer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set buyer(value: string) {
    this.set("buyer", Value.fromString(value));
  }

  get seller(): string {
    let value = this.get("seller");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set seller(value: string) {
    this.set("seller", Value.fromString(value));
  }
}

export class MarketplaceDailySnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save MarketplaceDailySnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type MarketplaceDailySnapshot must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("MarketplaceDailySnapshot", id.toString(), this);
    }
  }

  static load(id: string): MarketplaceDailySnapshot | null {
    return changetype<MarketplaceDailySnapshot | null>(
      store.get("MarketplaceDailySnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get marketplace(): string {
    let value = this.get("marketplace");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set marketplace(value: string) {
    this.set("marketplace", Value.fromString(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get collectionCount(): i32 {
    let value = this.get("collectionCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set collectionCount(value: i32) {
    this.set("collectionCount", Value.fromI32(value));
  }

  get cumulativeTradeVolumeETH(): BigDecimal {
    let value = this.get("cumulativeTradeVolumeETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set cumulativeTradeVolumeETH(value: BigDecimal) {
    this.set("cumulativeTradeVolumeETH", Value.fromBigDecimal(value));
  }

  get marketplaceRevenueETH(): BigDecimal {
    let value = this.get("marketplaceRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set marketplaceRevenueETH(value: BigDecimal) {
    this.set("marketplaceRevenueETH", Value.fromBigDecimal(value));
  }

  get creatorRevenueETH(): BigDecimal {
    let value = this.get("creatorRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set creatorRevenueETH(value: BigDecimal) {
    this.set("creatorRevenueETH", Value.fromBigDecimal(value));
  }

  get totalRevenueETH(): BigDecimal {
    let value = this.get("totalRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set totalRevenueETH(value: BigDecimal) {
    this.set("totalRevenueETH", Value.fromBigDecimal(value));
  }

  get tradeCount(): i32 {
    let value = this.get("tradeCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set tradeCount(value: i32) {
    this.set("tradeCount", Value.fromI32(value));
  }

  get cumulativeUniqueTraders(): i32 {
    let value = this.get("cumulativeUniqueTraders");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set cumulativeUniqueTraders(value: i32) {
    this.set("cumulativeUniqueTraders", Value.fromI32(value));
  }

  get dailyActiveTraders(): i32 {
    let value = this.get("dailyActiveTraders");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set dailyActiveTraders(value: i32) {
    this.set("dailyActiveTraders", Value.fromI32(value));
  }

  get dailyTradedCollectionCount(): i32 {
    let value = this.get("dailyTradedCollectionCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set dailyTradedCollectionCount(value: i32) {
    this.set("dailyTradedCollectionCount", Value.fromI32(value));
  }

  get dailyTradedItemCount(): i32 {
    let value = this.get("dailyTradedItemCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set dailyTradedItemCount(value: i32) {
    this.set("dailyTradedItemCount", Value.fromI32(value));
  }
}

export class CollectionDailySnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save CollectionDailySnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type CollectionDailySnapshot must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("CollectionDailySnapshot", id.toString(), this);
    }
  }

  static load(id: string): CollectionDailySnapshot | null {
    return changetype<CollectionDailySnapshot | null>(
      store.get("CollectionDailySnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get collection(): string {
    let value = this.get("collection");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set collection(value: string) {
    this.set("collection", Value.fromString(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get royaltyFee(): BigDecimal {
    let value = this.get("royaltyFee");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set royaltyFee(value: BigDecimal) {
    this.set("royaltyFee", Value.fromBigDecimal(value));
  }

  get dailyMinSalePrice(): BigDecimal {
    let value = this.get("dailyMinSalePrice");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set dailyMinSalePrice(value: BigDecimal) {
    this.set("dailyMinSalePrice", Value.fromBigDecimal(value));
  }

  get dailyMaxSalePrice(): BigDecimal {
    let value = this.get("dailyMaxSalePrice");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set dailyMaxSalePrice(value: BigDecimal) {
    this.set("dailyMaxSalePrice", Value.fromBigDecimal(value));
  }

  get cumulativeTradeVolumeETH(): BigDecimal {
    let value = this.get("cumulativeTradeVolumeETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set cumulativeTradeVolumeETH(value: BigDecimal) {
    this.set("cumulativeTradeVolumeETH", Value.fromBigDecimal(value));
  }

  get dailyTradeVolumeETH(): BigDecimal {
    let value = this.get("dailyTradeVolumeETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set dailyTradeVolumeETH(value: BigDecimal) {
    this.set("dailyTradeVolumeETH", Value.fromBigDecimal(value));
  }

  get marketplaceRevenueETH(): BigDecimal {
    let value = this.get("marketplaceRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set marketplaceRevenueETH(value: BigDecimal) {
    this.set("marketplaceRevenueETH", Value.fromBigDecimal(value));
  }

  get creatorRevenueETH(): BigDecimal {
    let value = this.get("creatorRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set creatorRevenueETH(value: BigDecimal) {
    this.set("creatorRevenueETH", Value.fromBigDecimal(value));
  }

  get totalRevenueETH(): BigDecimal {
    let value = this.get("totalRevenueETH");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set totalRevenueETH(value: BigDecimal) {
    this.set("totalRevenueETH", Value.fromBigDecimal(value));
  }

  get tradeCount(): i32 {
    let value = this.get("tradeCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set tradeCount(value: i32) {
    this.set("tradeCount", Value.fromI32(value));
  }

  get dailyTradedItemCount(): i32 {
    let value = this.get("dailyTradedItemCount");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set dailyTradedItemCount(value: i32) {
    this.set("dailyTradedItemCount", Value.fromI32(value));
  }
}

export class _OrderFulfillment extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save _OrderFulfillment entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type _OrderFulfillment must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("_OrderFulfillment", id.toString(), this);
    }
  }

  static load(id: string): _OrderFulfillment | null {
    return changetype<_OrderFulfillment | null>(
      store.get("_OrderFulfillment", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get trade(): string {
    let value = this.get("trade");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set trade(value: string) {
    this.set("trade", Value.fromString(value));
  }

  get orderFulfillmentMethod(): string | null {
    let value = this.get("orderFulfillmentMethod");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set orderFulfillmentMethod(value: string | null) {
    if (!value) {
      this.unset("orderFulfillmentMethod");
    } else {
      this.set("orderFulfillmentMethod", Value.fromString(<string>value));
    }
  }
}

export class _Item extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save _Item entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type _Item must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("_Item", id.toString(), this);
    }
  }

  static load(id: string): _Item | null {
    return changetype<_Item | null>(store.get("_Item", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}
