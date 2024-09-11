---
id: glossary
title: Glossary
---

# Glossary

#### Asset

Are digital tokens representing various forms of value, including cryptocurrencies, fiat currencies, and other financial instruments. They are uniquely identified by their **asset code** and the **issuer’s public key**, with [assets ](https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets)created through payment operations by the issuing account.

#### Automated market maker

An automated market maker is a smart contract on Soroban that holds on-chain liquidity reserves. Users can trade against these reserves at prices set by an automated market making formula.

#### Constant product formula

The automated market making algorithm used by Soroswap. See [x\*y=k](04-glossary.md#x--y--k).

**Core**\
Smart contracts that are essential for Soroswap to exist. Upgrading to a new version of core would require a liquidity migration.

**Factory**\
A smart contract that deploys a unique smart contract for any trading pair.

**Flash swap**\
A trade that uses the tokens being purchased before paying for them. Currently flash swaps are not supported in Soroswap as Soroban does not support reentrancy.

**Invariant**\
The "k" value in the constant product formula.

**Liquidity provider / LP**\
A liquidity provider is someone who deposits an equivalent value of two tokens into the liquidity pool within a pair. Liquidity providers take on price risk and are compensated with fees.

**Mid price**\
The price between what users can buy and sell tokens at a given moment. In Soroswap, this is the ratio of the two token reserves.

**Pair**\
A smart contract deployed from the Soroswap Factory that enables trading between two tokens.

**Periphery**\
External smart contracts that are useful, but not required for Soroswap to exist. New periphery contracts can always be deployed without migrating liquidity.

**Price impact**\
The difference between the mid-price and the execution price of a trade.

**Pool**\
Liquidity within a pair is pooled across all liquidity providers.

**Slippage**\
The amount the price moves in a trading pair between when a transaction is submitted and when it is executed.

**Token Interface**

Token interface standar. [Read more](https://developers.stellar.org/docs/smart-contracts/tokens/token-interface)

