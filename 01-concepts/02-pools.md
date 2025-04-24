---
id: pools
title: Pools
cover: ../.gitbook/assets/Captura de pantalla 2025-04-24 a las 15.20.59.png
coverY: 0
---

# Liquidity Pools

Each liquidity pool functions as a market for a specific pair of tokens.

<figure><img src="../.gitbook/assets/Captura de pantalla 2025-04-24 a las 15.07.19.png" alt=""><figcaption></figcaption></figure>

## Introduction

In Soroswap Finance, each liquidity pool acts as a trading venue for a pair of assets. When a pool is initially created, it starts with zero balance for each asset, requiring an initial deposit to facilitate trades. The first liquidity provider sets the initial price by depositing equal values of both assets, aligning with the current market rate. This prevents immediate arbitrage opportunities, which occur if the assets are deposited at a ratio different from the prevailing market price.

Subsequent liquidity providers must deposit assets proportional to the current pool price to prevent their contributions from being arbitraged. If they believe the current price is inaccurate, they can engage in arbitrage to adjust the price to their desired level before adding liquidity, ensuring their assets are valued correctly in the pool.

## Pool tokens

<figure><img src="../.gitbook/assets/Captura de pantalla 2025-04-24 a las 15.09.28.png" alt=""><figcaption></figcaption></figure>

When liquidity is deposited into a Soroswap liquidity pool, unique tokens known as pool tokens are minted and sent to the provider's address. These tokens represent the provider's stake in the pool and are a crucial component of the liquidity provision process. The number of pool tokens a provider receives is proportional to their contribution to the pool's total liquidity.

When seeding a new pool, the initial liquidity provider sets the quantities of the assets, and the relationship between these assets follows the equation (x \cdot y = k), where (x) and (y) are the amounts of each asset, and (k) is a constant that remains constant during the pool's operations.

Every time a trade is executed within the pool, a transaction fee of 0.3% is charged to the sender. This fee is then distributed pro-rata among all liquidity providers (LPs) in the pool, rewarding them for their participation and incentivizing continued liquidity provision.

To withdraw their original assets along with any accrued fees, liquidity providers must "burn" their pool tokens. This process effectively exchanges the tokens for their share of the pool's liquidity, including the proportional allocation of the collected fees.

Pool tokens themselves are tradable assets, providing flexibility to liquidity providers. They can sell, transfer, or utilize these tokens in various ways, offering additional liquidity management options and potential profit opportunities within the decentralized finance ecosystem.

> Learn more with advanced topics:

* [Understanding Returns](04-advanced-topics/03-understanding-returns.md)
* [Fees](01-fees.md)

## Why pools?

Soroswap Finance uses liquidity pools instead of traditional order books to enable decentralized token swaps. Liquidity pools consist of user-provided assets locked in smart contracts, allowing seamless, automated trades without relying on a centralized intermediary. This structure addresses key limitations of order books, such as the need for intermediaries, active management by market makers, and high infrastructure requirements.

Pools in Soroswap operate autonomously, leveraging smart contracts to continuously provide liquidity and execute trades. This design is more suited for decentralized ecosystems where tokens may have low liquidity and anyone can create or trade assets without permission. It simplifies the process, ensures more consistent liquidity, and opens up participation to a wider audience, including those without sophisticated trading tools.

By embracing a pool-based system, Soroswap benefits from the open, trustless, and permissionless nature of blockchain technology, allowing decentralized finance (DeFi) to thrive with minimal friction.

## Developer resources

* To see how to pool tokens in a smart contract read [Providing Liquidity](../01-protocol-overview/03-technical-reference/03-smart-contracts/04-soroswaprouter.md#add_liquidity).

