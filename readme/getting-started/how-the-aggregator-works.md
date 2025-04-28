---
icon: layer-minus
cover: ../../.gitbook/assets/Captura de pantalla 2025-04-28 a las 14.47.16.png
coverY: 0
---

# How the Aggregator Works

**The** [**Soroswap Aggregator**](https://docs.soroswap.finance/soroswap-aggregator) is a smart contract that optimally resolves each swap by finding **the best available price at the moment**, using **an intelligent distribution** across the [supported AMMs](https://docs.soroswap.finance/soroswap-aggregator/supported-amms).



### How It Works

* **Optimal Execution**: The Aggregator calculates and executes swaps across different AMMs to always find the best price.
* **Intelligent Routing**: Each swap is automatically distributed across one or more protocols according to available liquidity and exchange rates.
* **Fully On-Chain**: No intermediaries, no off-chain steps — the entire process is handled by smart contracts on Soroban.

<figure><img src="../../.gitbook/assets/Captura de pantalla 2025-04-28 a las 15.23.18.png" alt=""><figcaption></figcaption></figure>

### Supported AMMs

Currently, the Soroswap Aggregator sources liquidity from:

| AMM                      | Status      | Description                                                                             |
| ------------------------ | ----------- | --------------------------------------------------------------------------------------- |
| **Soroswap.Finance AMM** | Mainnet     | Soroswap's primary protocol on Soroban, offering fast, secure, and low-cost swaps.      |
| **Phoenix Protocol AMM** | Mainnet     | Providing additional liquidity and expanding swap route options.                        |
| **Aqua AMM**             | Coming Soon | Currently in testing. Will add more depth and route diversity to Soroban once deployed. |

> **Note**:\
> [Stellar SDEX ](https://docs.soroswap.finance/01-concepts/sdex)is not integrated as it is incompatible with Soroban smart contracts.\
> The Aggregator works exclusively with Soroban-based protocols.

