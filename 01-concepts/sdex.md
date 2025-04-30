---
cover: ../.gitbook/assets/Component 94.png
coverY: 0
---

# SDEX

What is Stellar SDEX, what is the difference with Soroswap.Finance and why it is not aggregated by the Soroswap Aggregator

### What is Stellar SDEX?

[**Stellar SDEX**](https://developers.stellar.org/docs/learn/encyclopedia/sdex) **(Stellar Decentralized Exchange)** is the native decentralized exchange of the Stellar network. It allows users to trade assets directly on the Stellar blockchain through a system of order books. Here’s how it operates:

* **Order Books:** Stellar SDEX uses order books to facilitate trades. Users place buy and sell offers in the order book, which are matched based on price and time priority.
* **Order Types:** Users can create various types of orders, such as market or limit orders. Orders are automatically matched against existing orders in the book.
* **Asset Exchange:** Trades are executed by matching buy and sell orders within the order books. Assets are exchanged directly between users without needing an intermediary.
* **Path Payments:** If there is no direct order for an asset pair, Stellar allows path payments to find the best route through multiple assets to complete the trade.

| Feature                    | Stellar SDEX                                                                                                                                          | Soroswap.Finance                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Exchange Model**         | [Order book](https://developers.stellar.org/docs/learn/encyclopedia/sdex/liquidity-on-stellar-sdex-liquidity-pools#order-books) (buy and sell orders) | [Automated Market Makers (AMMs)](https://docs.soroswap.finance/01-protocol-overview/01-how-soroswap-works)                       |
| **Pricing Mechanism**      | Based on matching orders in the order book                                                                                                            | Based on mathematical formulas[ (e.g., x \* y = k)](https://docs.soroswap.finance/01-protocol-overview/04-glossary#x-y-k)        |
| **Liquidity Provision**    | Users place orders in the order book                                                                                                                  | Users deposit assets into liquidity pools                                                                                        |
| **Transaction Execution**  | Executes orders directly based on price-time priority                                                                                                 | Executes transactions through AMM, adjusting prices according to reserves                                                        |
| **Order Types**            | Limit and passive orders                                                                                                                              | Interactions with AMM, no traditional limit orders                                                                               |
| **Aggregator Integration** | Generally not integrated into AMM aggregators                                                                                                         | Integrated into [aggregators that support AMMs](https://docs.soroswap.finance/soroswap-aggregator/how-soroswap-aggregator-works) |
