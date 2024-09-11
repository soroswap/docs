---
description: >-
  An aggregator aggregates several Soroban-based AMM (AMM based on Smart
  Contracts in the Stellar Blockchain)
---

# Aggregator

An **Aggregator** is a smart contract that allows users to execute asset swaps using **multiple protocols as sources of liquidity simultaneously**. In its operation, the Aggregator coordinates and distributes transactions across different protocols to optimize the outcomes of the swaps.

### Underlying Protocols (DEXES)

The [**Soroswap.Finance Aggregator**](https://github.com/soroswap/aggregator/blob/main/audits/2024-08-31\_Soroswap\_Aggregator\_Audit\_Summary\_by\_RuntimeVerification.pdf) integrates with the best AMMs (Automated Market Makers) currently deployed on the Soroban-Stellar Mainnet. These protocols provide the necessary liquidity to execute token swaps, allowing users to achieve optimal pricing and efficiency.  Currently the Aggregator aggregates liqudity from:

* **Soroswap.Finance AMM**: The main protocol of Soroswap, fully deployed on the Soroban-Stellar Mainnet. This AMM offers fast, secure, and low-cost token swaps, enabling users to interact with a wide range of token pairs.
* **Phoenix Protocol AMM** (currently on Testnet): Phoenix is in the testing phase and adds an additional layer of liquidity to the Soroban network. Once fully deployed on the mainnet, Phoenix will enhance the efficiency of token swaps.
* **Aqua AMM** (currently on Testnet): Another AMM in testing phase that provides additional liquidity on Soroban, allowing users to diversify swap routes and options.

> **Note:** [Stellar SDEX](https://docs.soroswap.finance/01-concepts/sdex) is not included as it is incompatible with Soroban-based smart contracts, and the Soroswap Aggregator only works with Soroban-based protocols.

### DexDistribution

Each time a user initiates a swap, the [Soroswap Router SDK ](https://docs.soroswap.finance/soroswap-router-sdk)automatically calculates the optimal way to split the trade across different **Underlying Protocols** (DEX) and routes. This is done through a mechanism called **`DexDistribution`**, which defines:

* The **protocols** used for the swap.
* The **fractions** of the total amount to be swapped in each protocol.
* The **path** of the swap, i.e., the sequence of tokens used to go from the input token to the output token.

### Example of DexDistribution

Let’s assume a user wants to swap **1000 XLM** for **USDC**. The Aggregator could split the swap among the different AMMs as follows:

* **80%** through **Soroswap AMM**, using the path: `XLM > EURC > USDC`.
* **10%** through **Phoenix AMM**, using the path: `XLM > BTC > USDC`.
* **10%** through **Aqua AMM**, using the path: `XLM > ETH > USDC`.

### Adapters

**Adapters** are smart contracts that handle communication between the Aggregator and the **Underlying Protocols**. These adapters allow the Aggregator to interact with different AMMs, adjusting parameters according to the standards of each protocol. Thus, adapters act as bridges between the Aggregator and the protocols, ensuring swaps are executed correctly on each platform.

{% hint style="info" %}
**Why doesn’t the Soroswap.Finance Aggregator include Stellar DEX in DexDistribution proposals?**\
Stellar DEX is not compatible with Soroban smart contracts, so the Aggregator only works with protocols that utilize Soroban technology.
{% endhint %}

### **Adapter Interface**

The communication between the Aggregator and adapters is defined by the **`SoroswapAggregatorAdapterTrait`**. Adapters must implement specific methods for initialization, data retrieval, and swap execution requests. This standardized design ensures that adapters can interact with multiple protocols, regardless of their individual differences.

