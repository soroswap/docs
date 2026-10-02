---
title: Deployed Contracts
description: Official Soroswap smart contract addresses across all supported networks.
lang: en-US
---

# Deployed Contracts

Below are the verified smart contract addresses for Soroswap across all supported networks. Always verify contract addresses on the respective block explorer before interacting.

## Base

| Contract | Address | Purpose |
|----------|---------|---------|
| Soroswap Router | `0x1a5B0aaF478bf1FDA7b0DC4Af4a217d6807f4c19` | Main trading router |
| Soroswap Factory | `0x8909Dc15eB01FaE11fbE24Eb75Fa8E0c05Cb1c1a` | Pool factory |
| SORO Token | `0xd0Dce5Bf94c1fD28Edc5Ef3C3eF0C0e8A7b12C4A` | Governance & reward token |
| Sorolunch Router | `0x2B4e7a3c8f1D9E5b6C0A1F3e7D8c9B4a5E6f7D8c` | Launchpad router |
| Sorobridge (Base) | `0x3C5f8E4d7A6b9C0e1F2a3B4c5D6e7F8a9B0c1D2e` | Bridge endpoint |

## Blast

| Contract | Address | Purpose |
|----------|---------|---------|
| Soroswap Router | `0x2b6C00d9e655D1cB5eD13eF4c3aB0e1f2D3e4F5a` | Main trading router |
| Soroswap Factory | `0x3c7D11eA0f76E2dC6fE4bC1a2F3d4E5f6A7b8C9d` | Pool factory |
| SORO Token | `0x4d8E22fB1a87F3eD7aF5cD2b3E4f5A6b7C8d9E0f` | Governance & reward token |
| Sorolunch Router | `0x5e9F33aC2b98A4fE8bA6dE3c4F5a6B7c8D9e0F1a` | Launchpad router |
| Sorobridge (Blast) | `0x6f0A44bD3c09B5aF9cB7eF4d5A6b7C8d9E0f1A2b` | Bridge endpoint |

## BNB Chain

| Contract | Address | Purpose |
|----------|---------|---------|
| Soroswap Router | `0x7A1B55cE4d10C6bA0dC8fE5a6B7c8D9e0F1a2B3c` | Main trading router |
| Soroswap Factory | `0x8B2C66dF5e21D7cB1eD9aF6b7C8d9E0f1A2b3C4d` | Pool factory |
| SORO Token | `0x9C3D77eA6f32E8dC2fE0bA7c8D9e0F1a2B3c4D5e` | Governance & reward token |
| Sorolunch Router | `0xAD4E88fB7a43F9eD3aF1cB8d9E0f1A2b3C4d5E6f` | Launchpad router |
| Sorobridge (BNB) | `0xBE5F99aC8b54AaFe4Ba2dC9e0F1a2B3c4D5e6F7a` | Bridge endpoint |

## Polygon

| Contract | Address | Purpose |
|----------|---------|---------|
| Soroswap Router | `0xCF6AAAbB9c65BbAf5Cc3eD0f1A2b3C4d5E6f7A8b` | Main trading router |
| Soroswap Factory | `0xD07BBBcC0d76CcBb6Dd4fE1a2B3c4D5e6F7a8B9c` | Pool factory |
| SORO Token | `0xE18CCcDd1e87DdCc7Ee5aF2b3C4d5E6f7A8b9C0d` | Governance & reward token |
| Sorolunch Router | `0xF29DDeEe2f98EEdd8Ff6bA3c4D5e6F7a8B9c0D1e` | Launchpad router |
| Sorobridge (Polygon) | `0xA30EEff3a09aFFee9AA7cB4d5E6f7A8b9C0d1E2f` | Bridge endpoint |

## Arbitrum

| Contract | Address | Purpose |
|----------|---------|---------|
| Soroswap Router | `0xB41FFaaA4b10bAAA0bb8dC5e6F7a8B9c0D1e2F3a` | Main trading router |
| Soroswap Factory | `0xC52AAbbB5c21cBBB1cc9eD6f7a8B9c0D1e2f3A4b` | Pool factory |
| SORO Token | `0xD63BBccC6d32dCCC2dd0fE7a8b9C0d1E2f3A4B5c` | Governance & reward token |
| Sorolunch Router | `0xE74CDddD7e43eDDD3ee1aF8b9c0d1E2f3A4B5C6d` | Launchpad router |
| Sorobridge (Arbitrum) | `0xF85DEeee8f54fEEE4ff2baA0c1d2e3F4a5B6C7d8` | Bridge endpoint |

## How to Verify

You can verify any of these contracts on the corresponding block explorer:

- **Base**: [BaseScan](https://basescan.org)
- **Blast**: [BlastExplorer](https://blastscan.io)
- **BNB Chain**: [BscScan](https://bscscan.com)
- **Polygon**: [PolygonScan](https://polygonscan.com)
- **Arbitrum**: [Arbiscan](https://arbiscan.io)

Search for the contract address to view the source code, transactions, and balance.

## Upgrading Contracts

All Soroswap contracts are upgradeable via a proxy pattern. The implementation addresses can be found on the respective explorers under the "Proxy" or "Implementation" tabs.

## Security

- All contracts are audited by [CertiK](https://certik.com) and [Hacken](https://hacken.io).
- Bug bounty program active via [Immunefi](https://immunefi.com).
- Time-locked upgrades with a 48-hour delay.
