---
id: glossary
title: Glossary
---

# Glossary

#### Asset

Are digital tokens representing various forms of value, including cryptocurrencies, fiat currencies, and other financial instruments. They are uniquely identified by their **asset code** and the **issuer’s public key**, with [assets ](https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets)created through payment operations by the issuing account.

Assets in Soroban, the smart contract platform of Stellar are also identified by the [Stellar Asset Contract](https://developers.stellar.org/docs/build/guides/tokens) (SAC), which is the address of the smart contract associated to the asset. 

For example, for the USDC token, a stable coin emmited by Circle, we have several ways to identify this asset

```
{
      "code": "USDC",
      "issuer": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
      "contract": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      "name": "USD Coin"
    }
```

In Soroswap we use either the SAC contract address, or the CODE:ISSUER combination

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
A smart contract deployed from the Soroswap Factory that enables trading between two tokens. Pair contracts are also called "Pools" because they are the contracts that hold the liquidity of both tokens.

Example: The [`CDJDRGUCHANJDXALZVJ5IZVB76HX4MWCON5SHF4DE5HB64CBBR7W2ZCD`](https://stellar.expert/explorer/public/contract/CDJDRGUCHANJDXALZVJ5IZVB76HX4MWCON5SHF4DE5HB64CBBR7W2ZCD) contract is the Pair/Pool contract that holds liquidity for the XLM-USDx pair.

Check all Soroswap AMM pairs in https://dune.com/queries/4341139/7289687 

**Periphery**\
External smart contracts that are useful, but not required for Soroswap to exist. New periphery contracts can always be deployed without migrating liquidity.

**Price impact**\
The difference between the mid-price and the execution price of a trade.

**Pool**\
Liquidity within a pair is pooled across all liquidity providers. See "Pair"

**Slippage**\
The amount the price moves in a trading pair between when a transaction is submitted and when it is executed. Is the same as "price impact", and often is expressed in percentage.

**Token Interface**

Token interface standar. [Read more](https://developers.stellar.org/docs/smart-contracts/tokens/token-interface)

