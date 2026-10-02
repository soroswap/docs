---
title: Sorodex — AMM Trading Engine
description: Learn how Sorodex works, how to add liquidity, swap tokens, and earn fees on Soroswap.
lang: en-US
---

# Sorodex

**Sorodex** is the core AMM (Automated Market Maker) engine of the Soroswap protocol. It enables permissionless token swaps and liquidity provision across all supported networks.

## How It Works

Sorodex uses a constant product formula ($x \cdot y = k$) to facilitate trades without traditional order books. Every swap adjusts the reserves of the paired tokens while preserving the invariant $k$.

### Key Features

- **Permissionless Pools**: Anyone can create a liquidity pool for any token pair.
- **Low Slippage**: Deep liquidity and optimized routing minimize price impact.
- **Fee on Swap**: A small fee (typically 0.3%) is charged on each swap and distributed to liquidity providers.
- **Referral System**: Traders can attach a referral code to earn bonuses.

## How to Swap

1. Connect your wallet to [app.soroswap.io](https://app.soroswap.io).
2. Select the source and destination tokens.
3. Enter the amount you wish to swap.
4. Review the quote, slippage tolerance, and price impact.
5. Confirm the transaction.

## Adding Liquidity

Liquidity providers (LPs) are essential to the protocol. Here's how to get started:

1. Navigate to the **Liquidity** tab on the Soroswap app.
2. Select the token pair you want to provide liquidity for.
3. Deposit equal value of both tokens.
4. Receive LP tokens representing your share of the pool.
5. Earn a proportional share of the swap fees.

## Risk Notice

- **Impermanent Loss**: Providing liquidity carries the risk of impermanent loss. Read more in our [FAQ](./faq.md).
- **Smart Contract Risk**: Always audit contract code before interacting.
