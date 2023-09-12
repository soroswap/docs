---
id: how-soroswap-works
title: How Soroswap works
---

# How Soroswap works

![](<images/anatomy (1).jpg>)

Soroswap is an _automated liquidity protocol_ powered by a [constant product formula](./04-glossary.md/#constant-product-formula) and implemented in a system of non-upgradeable smart contracts on the [Soroban](https://soroban.stellar.org) blockchain. It obviates the need for trusted intermediaries, prioritizing **decentralization**, **censorship resistance**, and **security**. Soroswap is **open-source software** licensed under the [Apache 2.0 Licence](https://github.com/soroswap/core/blob/main/LICENSE).

Each Soroswap smart contract, or pair, manages a liquidity pool made up of reserves of two tokens. These can be either (1) Soroban native tokens implemeting the [Soroban Token Interface](https://soroban.stellar.org/docs/reference/interfaces/token-interface), or (2) [Stellar Assets](https://developers.stellar.org/docs/issuing-assets/anatomy-of-an-asset)

Anyone can become a liquidity provider (LP) for a pool by depositing an equivalent value of each underlying token in return for pool tokens. These tokens track pro-rata LP shares of the total reserves, and can be redeemed for the underlying assets at any time.

![](<images/lp (1).jpg>)

Pairs act as automated market makers, standing ready to accept one token for the other as long as the “constant product” formula is preserved. This formula, most simply expressed as `x * y = k`, states that trades must not change the product (`k`) of a pair’s reserve balances (`x` and `y`). Because `k` remains unchanged from the reference frame of a trade, it is often referred to as the invariant. This formula has the desirable property that larger trades (relative to reserves) execute at exponentially worse rates than smaller ones.

In practice, Soroswap applies a 0.30% fee to trades, which is added to reserves. As a result, each trade actually increases `k`. This functions as a payout to LPs, which is realized when they burn their pool tokens to withdraw their portion of total reserves. In the future, this fee may be reduced to 0.25%, with the remaining 0.05% withheld as a protocol-wide charge.

![](<images/trade (1).jpg>)

Because the relative price of the two pair assets can only be changed through trading, divergences between the Soroswap price and external prices create arbitrage opportunities. This mechanism ensures that Soroswap prices always trend toward the market-clearing price.

## Further reading

To see how token swaps work in practice, and to walk through the lifecycle of a swap, check out [Swaps](../03-core-concepts/01-swaps.md/). Or, to see how liquidity pools work, see [Pools](../03-core-concepts/01-pools.md/).

Ultimately, of course, the Soroswap protocol is just smart contract code running on Soroban. To understand how they work, head over to [The Soroban Home Page](https://soroban.stellar.org/docs/).
