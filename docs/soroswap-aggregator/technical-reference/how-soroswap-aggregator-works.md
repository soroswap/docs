---
title: How Soroswap Aggregator Works
description: Technical deep dive into the Soroswap Aggregator routing engine and on-chain execution.
sidebar_position: 3
---

# How Soroswap Aggregator Works

The Soroswap Aggregator is an off-chain routing engine combined with on-chain Soroban contracts that finds the best execution path across Soroswap pools and integrated DEXs on Stellar.

> **Updated 2025-12-19** - Documentation upgraded to Aggregator v2 architecture.

## Overview

The aggregator works in three phases:

1. **Quote Request** - The client sends a swap request with `fromAsset`, `toAsset`, `amount`, and `slippage`.
2. **Route Discovery** - The off-chain engine queries live pool reserves from Soroswap V2, StellarX and partner AMMs, builds a graph of possible hops and simulates execution using the new `find_best_route_v2` algorithm.
3. **Execution** - The optimal route is encoded into a Soroban transaction that is executed atomically via the `SoroswapRouter` contract.

## Updated Architecture v2

### Routing Engine
* Multi-hop support up to 5 hops
* Gas and price impact aware scoring
* Real-time reserve caching with 500ms TTL
* Fallback to direct pool if no multi-hop improves price

### On-chain Contracts
* `SoroswapRouter` - `CA3...` on Soroban testnet / `CB7...` on mainnet
* `SoroswapAggregator` - `CD1...` on Soroban testnet / `CE2...` on mainnet

The router contract validates the route signature generated off-chain and executes the swaps in a single atomic transaction, reverting on slippage breach.

## Execution Flow

```mermaid
User -> Aggregator API
Aggregator API -> Route Discovery Engine
Route Discovery Engine -> Pool Indexer
Pool Indexer --> Route Discovery Engine
Route Discovery Engine -> SoroswapRouter Contract
SoroswapRouter Contract -> Stellar Network
```

For SDK usage see [Soroswap Router SDK](/soroswap-api/07-optimal-route#soroswap-router-sdk).
