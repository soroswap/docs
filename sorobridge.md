---
title: Sorobridge — Cross-Chain Bridge
description: Move assets between chains seamlessly with Sorobridge, Soroswap's native cross-chain messaging layer.
lang: en-US
---

# Sorobridge

**Sorobridge** is Soroswap's native cross-chain bridge, enabling users to transfer tokens and messages across multiple EVM-compatible blockchains.

## Supported Chains

- Base
- Blast
- BNB Chain
- Polygon
- Arbitrum

## How It Works

Sorobridge leverages a locked-and-mint architecture:

1. **Lock**: User locks tokens in the source chain's bridge contract.
2. **Message**: A message is sent via the bridge's messaging layer (e.g., LayerZero, Axelar, or custom solution).
3. **Mint**: The destination chain's bridge contract mints equivalent tokens and sends them to the user.

### Key Features

- **Fast Finality**: Cross-chain transfers complete in under 2 minutes on most chains.
- **Low Fees**: Optimized gas usage across all supported networks.
- **Native Token Support**: Supports ETH, USDC, and all Soroswap-native tokens (SORO, etc.).
- **Wrapped Assets**: Automatically wraps/unwraps assets as needed.

## How to Bridge

1. Go to [app.soroswap.io/bridge](https://app.soroswap.io/bridge).
2. Select the source chain and destination chain.
3. Choose the token and enter the amount.
4. Review the bridge fee and estimated time.
5. Confirm the transaction on the source chain.
6. Wait for confirmation on the destination chain.

## Security

- All bridge contracts are audited by reputable firms.
- Multi-signature wallets control administrative functions.
- Emergency pause functionality is available.
