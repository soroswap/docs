---
description: >-
  To get started, you need a wallet compatible with the Stellar network and able
  to interact with Soroban smart contracts. Here's how to choose one and connect
  it.
icon: wallet
cover: ../../.gitbook/assets/Component 97.png
coverY: 123
---

# Wallet Setup and Connection

### What to Look For in a Wallet

* **Stellar asset support**: Must handle native XLM and custom tokens (stablecoins, NFTs, etc.).
* **Clean UI**: Easy to use on browser, desktop, or mobile.
* **Non-custodial**: You retain full control of your private keys.
* **Backup & recovery options**: For secure account restoration.
* **dApp compatibility**: Must work with Soroban-based contracts.
* **Multi-account support**: Manage multiple addresses from a single interface.

### ✅ Compatible Wallets with Soroswap.Finance

These wallets are fully integrated via [`stellar-wallets-kit`](https://github.com/paltalabs/soroban-react-stellar-wallets-kit) and work seamlessly with the Soroswap app.

| Wallet                                        | Type                       | Best for                  | Key Features                                      |
| --------------------------------------------- | -------------------------- | ------------------------- | ------------------------------------------------- |
| [**Freighter**](https://www.freighter.app/)   | Browser extension, web     | Web users & dApps         | Fast, non-custodial, multi-account support        |
| [**xBull**](https://xbull.app/)               | Web, mobile, extension     | Advanced users, traders   | Multi-asset, built-in swap, open source           |
| [**Hana Wallet**](https://www.hanawallet.io/) | Mobile, web                | Beginners & privacy-first | Simple UI, multi-chain, Stellar NFTs              |
| [**Lobstr**](https://lobstr.co/)              | Mobile, web                | Everyday use              | Friendly UI, social payments, widely used         |
| [**Rabet**](https://rabet.io/download)        | Extension, desktop, mobile | Desktop-first new users   | Lightweight, intuitive, good for dApp interaction |
| [**Albedo**](https://albedo.link/)            | Web (redirect)             | Quick signing             | No install needed, fast transaction authorization |
| [**HOT Wallet**](https://hot-labs.org/)       | Telegram mini app          | Multi-chain web3 users    | Non-custodial, $HOT token mining, EVM support     |

> **Quick Recommendations**\ <sup>- Using Soroswap in the browser? → Go with</sup> <sup></sup><sup>**Freighter**</sup><sup>,</sup> <sup></sup><sup>**Rabet**</sup><sup>, or</sup> <sup></sup><sup>**xBull**</sup>\ <sup>- Prefer mobile? → Try</sup> <sup></sup><sup>**Lobstr**</sup><sup>,</sup> <sup></sup><sup>**Hana**</sup><sup>, or</sup> <sup></sup><sup>**HOT Wallet**</sup>\ <sup>- Need fast signing with no setup? → Use</sup> <sup></sup><sup>**Albedo**</sup>

### 🌐 Connecting to the Stellar Network

Connecting your wallet to Stellar is required to interact with tokens, perform swaps, and use Soroban dApps.

### [Choosing the Network](https://developers.stellar.org/docs/learn/fundamentals/networks)

* **Mainnet**: For real transactions and assets.\
  Passphrase: `Public Global Stellar Network ; September 2015`
* **Testnet**: For development and testing (used with Soroswap test version).\
  Passphrase: `Test SDF Network ; December 2014`

> To learn how to use  [Soroswap Testnet Overview](https://docs.soroswap.finance/05-tutorial/01-soroswap-testnet-overviews).

### Configuring Your Wallet

* **Select network**: Most wallets allow switching between Mainnet and Testnet in settings.
* **Enter** [**passphrase**](https://developers.stellar.org/docs/networks): Required by some wallets to connect correctly.
* **(Optional)** [**Set custom Horizon node**](https://developers.stellar.org/docs/data/horizon/horizon-providers#ecosystem-horizon-providers): Advanced users can configure a custom Horizon URL (e.g., ANKR node).

####
