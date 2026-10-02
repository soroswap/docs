---
title: Optimal Route
description: How to get the best route and use the Soroswap Router SDK.
sidebar_position: 7
---

# Optimal Route

The Optimal Route API returns the best execution path for a swap across Soroswap and integrated liquidity sources.

## Endpoint

`GET /v2/optimal-route`

Query params: `from`, `to`, `amount`, `slippage`

## Response

```json
{
  "route": [
    {"pool": "soroswap-v2", "from": "XLM", "to": "USDC", "amountIn": "10000000"},
    {"pool": "soroswap-v2", "from": "USDC", "to": "wBTC", "amountOut": "0.012"}
  ],
  "priceImpact": 0.0042,
  "gasEstimate": 120000
}
```

## Soroswap Router SDK

The Router SDK v2 provides a TypeScript client for route discovery and transaction building.

> **Updated 2025-12-19** - SDK upgraded to `@soroswap/router-sdk@^2.0.0`

### Installation

```bash
npm i @soroswap/router-sdk@^2.0.0
```

### Usage

```ts
import { SoroswapRouter, Network } from '@soroswap/router-sdk';

const router = new SoroswapRouter({
  network: Network.MAINNET,
  apiKey: process.env.SOROSWAP_API_KEY
});

const route = await router.getOptimalRoute({
  fromAsset: 'XLM',
  toAsset: 'USDC',
  amount: '10000000',
  slippageBps: 50
});

const tx = await router.buildTransaction(route, {
  sourceAccount: myAccount,
  fee: '100'
});

console.log(tx.toXDR());
```

### Migration from v1

* Import changed from `Router` to `SoroswapRouter`
* `getOptimalRoute` now returns a typed `RouteV2` object
* `buildTransaction` requires explicit `sourceAccount`
* Network enum renamed to `Network.MAINNET / Network.TESTNET`

See the [Aggregator technical reference](/soroswap-aggregator/technical-reference/how-soroswap-aggregator-works) for architecture details.
