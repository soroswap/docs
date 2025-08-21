---
description: >-
  What is a bridge, Soroswap Implements the Spacewalk Bridge between Stellar and
  Polkadot
hidden: true
cover: ../.gitbook/assets/Captura de pantalla 2025-04-29 a las 15.01.53.png
coverY: 0
---

# Bridge

### What is a Bridge?

In blockchain technology, a **bridge** is a protocol that connects two or more blockchain networks, enabling them to interact and exchange assets or data. Bridges are crucial for improving interoperability between different blockchains, which often operate independently of one another.

### Key Functions of a Bridge

* **Asset Transfer:** Bridges facilitate the transfer of assets, such as tokens or cryptocurrencies, between different blockchains. This is essential for users who wish to move their assets from one blockchain ecosystem to another.
* **Data Exchange:** Bridges allow for the transfer of data between blockchains, enabling different networks to share information and synchronize their activities.
* **Interoperability:** By connecting disparate blockchains, bridges enhance interoperability, allowing applications and users to operate seamlessly across multiple blockchain platforms.

### How Bridges Work

1. **Locking and Minting:**
   * **Locking:** Assets are locked on the source blockchain to prevent double-spending or misuse.
   * **Minting:** Corresponding assets are minted or issued on the destination blockchain, allowing users to access them within the new ecosystem.
2. **Verification:** The bridge verifies transactions and ensures that assets are securely locked on the source blockchain before issuing the equivalent assets on the destination blockchain.
3. **Reverse Transfers:** Bridges also handle the process of transferring assets back to the original blockchain, ensuring that assets are locked on the destination chain before unlocking or issuing them on the source chain.

### Soroswap Implements the Spacewalk Bridge between Stellar and Polkadot

Soroswap Finance has developed the [**Spacewalk Bridge**](https://pendulumchain.org/spacewalk) to enable interoperability between the Stellar and Polkadot blockchains. This bridge facilitates seamless transfers of assets and data between these two distinct blockchain networks.

### How the Spacewalk Bridge Works

1. **Asset Locking and Minting:**
   * **On Stellar:** When a user initiates a transfer from Stellar to Polkadot, the [Spacewalk Bridge](https://pendulumchain.org/spacewalk) locks the assets on the Stellar network.
   * **On Polkadot:** After assets are locked on Stellar, the bridge mints or issues an equivalent amount of assets on Polkadot, enabling their use within the Polkadot ecosystem.
2. **Transfer Process:**
   * **Initiation:** Users request to transfer assets through the Spacewalk Bridge interface.
   * **Verification:** The bridge verifies the transaction, ensuring that the assets are securely locked on Stellar.
   * **Issuance:** The bridge then issues the equivalent assets on Polkadot, making them available for use on the Polkadot network.
3. **Reverse Transfers:**
   * **On Polkadot:** To transfer assets back to Stellar, the bridge locks the assets on Polkadot.
   * **On Stellar:** The equivalent assets are then unlocked or issued back on Stellar, completing the transfer process.
