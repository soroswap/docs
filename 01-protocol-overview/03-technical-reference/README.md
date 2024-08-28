# Technical Reference

The Soroswap Protocol is inspired in [UniswapV2](https://github.com/Uniswap/v2-core/). Contracts are written in rust using the Soroban SDK, implementing all the functionalities of UniswapV2, with some limitations of rust (see further)

The Soroswap.Finance protocol consists in:

1.- A **Pair** contract (liquidity pool) (The **SoroswapPair** contract): They serve as automated market makers (AMM) and keep track of pool token balances. In Soroban, these contracts implements the Stellar token interface

2.- A **Factory** contract (The **SoroswapFactory** contract): Creates one Liquidity Pool Token smart contract per unique token pair.

With this approach, any user can start a new liquidity pool pair from the front-end, and hence without knowing how to code, or without needing to manually deploy a smart contract using the soroban-cli software.



Check all the code of the Soroswap AMM in [http://github.com/soroswap/core](http://github.com/soroswap/core)
