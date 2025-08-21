---
id: smart-contracts
title: Smart contracts
cover: ../../../.gitbook/assets/Component 94.png
coverY: 0
---

# Smart contracts

Soroswap is a smart contract system. [Core](./#core) contracts provide fundamental safety guarantees for all parties interacting with Soroswap. [Periphery](./#periphery) contracts interact with one or more core contracts but are not themselves part of the core.

## Core

[Source code](https://github.com/soroswap/core)

The core consists of a singleton [factory](./#factory) and many [pairs](./#pairs), which the factory is responsible for creating and indexing. These contracts are quite minimal, even brutalist. The simple rationale for this is that contracts with a smaller surface area are easier to reason about, less bug-prone, and more functionally elegant. Perhaps the biggest upside of this design is that many desired properties of the system can be asserted directly in the code, leaving little room for error. One downside, however, is that core contracts are somewhat user-unfriendly. In fact, interacting directly with these contracts is not recommended for most use cases. Instead, a periphery contract should be used.

### SoroswapFactory:

[Reference documentation](02-soroswapfactory.md)

The factory holds the generic bytecode responsible for powering pairs. Its primary job is to create one and only one smart contract per unique token pair. It also contains logic to turn on the protocol charge.

### SoroswapPairs:

[Reference documentation](01-soroswappair.md)

Pairs have two primary purposes: serving as automated market makers and keeping track of pool token balances. They also expose data which can be used to build decentralized price oracles.

## Periphery:

[Source code](https://github.com/soroswap/core/tree/main/contracts)

The periphery is a constellation of smart contracts designed to support domain-specific interactions with the core. Because of Soroswap's permissionless nature, the contracts described below have no special privileges, and are in fact only a small subset of the universe of possible periphery-like contracts. However, they are useful examples of how to safely and efficiently interact with the Soroswap Protocol.

### SoroswapLibrary:

[Reference documentation](03-soroswaplibrary.md)

The library provides a variety of convenience functions for fetching data and pricing.

### SoroswapRouter:

[Reference documentation](04-soroswaprouter.md)

The router, which uses the library, fully supports all the basic requirements of a front-end offering trading and liquidity management functionality.&#x20;
