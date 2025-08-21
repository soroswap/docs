---
cover: ../.gitbook/assets/Captura de pantalla 2025-04-29 a las 15.01.53.png
coverY: 0
---

# Trustlines

In **Soroswap Finance**, a _trustline_ is an essential mechanism that allows your account on the Stellar network to hold and exchange a specific asset. This process is crucial for interacting with the assets you wish to trade on the platform.&#x20;

### **What is a Trustline?**

A [_trustline_ ](https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#trustlines)is an explicit authorization that you establish between your account and an issuing account of an asset on the Stellar network. Essentially, it tells Stellar that you trust a specific issuer to allow your account to receive and handle that asset. Without an appropriate _trustline_, you cannot hold or trade that asset within your account.\


### **How Trustlines Function**

* **Holding Assets:** To hold a specific asset, an account needs to have a [trustline](https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#trustlines) with the issuing account of that asset. This setup allows the account to keep track of the asset's balance and also imposes a limit on the amount of that asset the account can hold.
* **Receiving Assets:** A trustline must be established for an account to receive any asset, except for Lumens (XLM). While it’s possible to create a claimable balance to send assets to an account without an existing trustline, the recipient must still create a trustline to claim the balance. Learn more about [Claimable Balances here.](https://developers.stellar.org/docs/learn/encyclopedia/transactions-specialized/claimable-balances)
* [**Trustlines track**](https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/accounts#trustlines) **liabilities for asset trades in two ways:** Buying Liabilities, which are the total amount of an asset an account offers to buy across all its offers, and Selling Liabilities, which are the total amount of an asset an account offers to sell across all its offers.

_An account must maintain a balance that is large enough to cover its selling liabilities and sufficiently below its limit to handle its buying liabilities._

<figure><img src="../.gitbook/assets/Captura de pantalla 2025-04-29 a las 15.07.00.png" alt=""><figcaption></figcaption></figure>

### &#x20;[**Trustlines**](https://developers.stellar.org/docs/learn/encyclopedia/sdex/liquidity-on-stellar-sdex-liquidity-pools#trustlines) **for Liquidity Pools**

To participate in a[ liquidity poo](https://docs.soroswap.finance/05-tutorial/04-adding-liquidity)l and perform [swaps](https://docs.soroswap.finance/05-tutorial/05-doing-swap) on Soroswap Finance, you need to establish trustlines for the following three types of assets:

* **Reserve Assets:** These are the assets held within the liquidity pool. To participate in a pool, you must establish a trustline with each of the reserve assets that make up the pool. For example, if the liquidity pool contains assets A and B, you will need trustlines for both asset A and asset B.
* **Pool Share Assets:** This asset represents your share of the liquidity pool. You need a trustline for each pool share associated with the pool you want to participate in. The trustline for the pool share allows you to receive and manage your proportional part of the pool.
* **Lumens (XLM):** In some cases, especially if one of the reserve assets is XLM, you do not need to establish a specific trustline for XLM, as trustlines for XLM are not required. However, if the liquidity pool does not include XLM as one of the reserve assets, you will need to establish trustlines for all the assets involved in the pool.

### **Trustlines for Performing Swaps**

To exchange assets on Soroswap Finance using the path payments system, you also need to establish trustlines:

* **Assets to be Exchanged:** You must establish trustlines for each asset you wish to exchange. For example, if you want to swap Asset X for Asset Y, you need to have a trustline for both Asset X and Asset Y.
* **Asset Management:** Once you have established the trustlines, your account can receive and manage these assets, allowing you to perform swaps safely and effectively.



