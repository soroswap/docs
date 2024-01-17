### Tutorial: Importing Testnet Tokens for Use in Soroban

#### Introduction

This tutorial will guide you through the process of importing testnet tokens, specifically Stellar Classic assets, and wrapping them for use with Soroban. We will use a Bash script to automate this process.

#### Prerequisites

- Basic understanding of blockchain concepts and the Stellar network.
- A system with Bash shell.
- The `jq` tool installed for JSON processing.

#### Overview of the Script

The provided Bash script performs several key functions:

- Reading and merging asset lists from JSON files.
- Wrapping each asset to be compatible with Soroban.
- Updating a token list with new Soroban addresses.

you can find this script here [setup_stellar_classic_assets.sh](https://github.com/soroswap/core/blob/main/scripts/setup_stellar_classic_assets.sh)

#### Script Breakdown

1. **Setting Environment Variables and Directories**

   ```bash
   ASSETS_DIRECTORY="/path/to/known_stellar_classic_assets.json"
   GENERATED_STELLAR_ASSETS="/path/to/generated_stellar_assets.json"
   ```

   - `ASSETS_DIRECTORY` and `GENERATED_STELLAR_ASSETS` point to the JSON files containing asset information.
   - `known_stellar_classic_assets.json` example

   ```json
   {
     "tokens": [
       {
         "symbol": "USDC",
         "name": "centre.ioUSDCoin",
         "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
         "asset": "USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
       }
     ]
   }
   ```

2. **Reading and Merging Asset Lists**

```bash
CLASSIC_ASSETS_JSON=$(jq '.tokens' "$ASSETS_DIRECTORY")
GENERATED_ASSETS_JSON=$(jq '.tokens' "$GENERATED_STELLAR_ASSETS")
```

These commands extract the token lists from JSON files and merge them.

3. **Wrapping Assets**

   ```bash
   TOKEN_ADDRESS=$(soroban lab token id --network "$NETWORK" --asset "$ASSET")
   ```

   This is the critical line where each asset is wrapped. The `soroban lab token id` command retrieves the Soroban-compatible address for each asset.

4. **Looping Through Assets**
   The script loops through each asset in the merged list, wrapping them and updating the token list with their new Soroban addresses.

5. **Updating the Token List**
   The updated token addresses are saved back to the `TOKENS_DIRECTORY`, ensuring that the assets are now usable in Soroban.

6. **Error Handling and Outputs**
   The script includes checks to handle errors and provide informative output messages throughout the process.

#### Running the Script

1. Ensure you have the necessary JSON files in the specified directories.
2. Run the script in your Bash shell:
   ```bash
   ./setup_stellar_classic_assets.sh [network]
   ```
   Replace `[network]` with the desired network type (e.g., `testnet`).

#### Conclusion

Following these steps, you can efficiently wrap Stellar Classic assets for use with Soroban. This script automates the process, simplifying the integration of various assets into the Soroban ecosystem.
