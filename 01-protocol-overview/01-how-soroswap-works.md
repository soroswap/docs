---
id: how-soroswap-works
title: How Soroswap works
cover: ../.gitbook/assets/Component 94.png
coverY: 0
---

# How Soroswap AMM works

###

### Quick Reference

<figure><img src="../.gitbook/assets/Captura de pantalla 2025-04-24 a las 15.07.19.png" alt=""><figcaption></figcaption></figure>

Soroswap AMM is an _automated liquidity protocol_ powered by a [constant product formula](04-glossary.md#constant-product-formula) and implemented in a system of non-upgradeable smart contracts on the [Soroban](https://developers.stellar.org/docs/smart-contracts) blockchain. It obviates the need for trusted intermediaries, prioritizing **decentralization**, **censorship resistance**, and **security**. Soroswap is **open-source software** licensed under the [Apache 2.0 Licence](https://github.com/soroswap/core/blob/main/LICENSE).

Each Soroswap Pair smart contract, manages a liquidity pool made up of reserves of two tokens. These can be either (1) Soroban native tokens implemeting the [Soroban Token Interface](https://developers.stellar.org/docs/smart-contracts/tokens/token-interface), or (2) [Stellar Assets](https://developers.stellar.org/docs/issuing-assets/anatomy-of-an-asset)

Anyone can become a liquidity provider (LP) for a pool by depositing an equivalent value of each underlying token in return for pool tokens. These tokens track pro-rata LP shares of the total reserves, and can be redeemed for the underlying assets at any time.



<figure><img src="../.gitbook/assets/Captura de pantalla 2024-09-20 a las 15.42.48.png" alt=""><figcaption></figcaption></figure>

Pairs act as automated market makers, standing ready to accept one token for the other as long as the “constant product” formula is preserved. This formula, most simply expressed as `x * y = k`, states that trades must not change the product (`k`) of a pair’s reserve balances (`x` and `y`). Because `k` remains unchanged from the reference frame of a trade, it is often referred to as the invariant. This formula has the desirable property that larger trades (relative to reserves) execute at exponentially worse rates than smaller ones.

In practice, Soroswap applies a 0.30% fee to trades, which is added to reserves. As a result, each trade actually increases `k`. This functions as a payout to LPs, which is realized when they burn their pool tokens to withdraw their portion of total reserves. In the future, this fee may be reduced to 0.25%, with the remaining 0.05% withheld as a protocol-wide charge. This is the only change that the protocol accepts. The total 0.30% fee it's hardcoded in the code and cannot be changed.



<figure><img src="../.gitbook/assets/Captura de pantalla 2024-09-20 a las 16.20.55.png" alt=""><figcaption></figcaption></figure>

Because the relative price of the two pair assets can only be changed through trading, divergences between the Soroswap price and external prices create arbitrage opportunities. This mechanism ensures that Soroswap prices always trend toward the market-clearing price.

## Further reading

To see how token swaps work in practice, and to walk through the lifecycle of a swap, check out [Swaps](broken-reference). Or, to see how liquidity pools work, see [Pools](../01-concepts/02-pools.md).

Ultimately, of course, the Soroswap protocol is just smart contract code running on Soroban. To understand how they work, head over to [The Soroban Home Page](https://developers.stellar.org/docs/smart-contracts).
