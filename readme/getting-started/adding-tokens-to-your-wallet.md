---
description: >-
  To add a specific token to your Stellar wallet, you need the following asset
  information. We'll use the example of the USDC token issued by the account
  mentioned.
---

# Adding Tokens to Your Wallet

### Obtain Asset Information

To add an asset to your Stellar wallet, you need to obtain the following information about the token you wish to add:

1. [**Asset Code**:](https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets#asset-code)
   * **Description**: This is the unique identifier or symbol for the token (e.g., `USDC`).
   * **How to Obtain**: The asset code is typically provided by the token issuer or can be found in the token's official documentation.
2. **Issuer's Public Key**:
   * **Description**: This is the public key of the account that issued the token (e.g., `GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`).
   * **How to Obtain**: The issuer's public key is usually provided by the token issuer. It can also be found in public Stellar directories such as [StellarExpert](https://stellar.expert/explorer/public) or on the issuer's website.
3. **Additional Details (Optional but Useful)**:
   * **Issuer Domain**: `centre.io`
   * **Issuer URL**: [https://centre.io](https://centre.io/)
   * **Asset Description**: This field can be optional in some wallets but provides additional context about the token.

**Note**: _Ensure that you verify this information from reliable sources to avoid errors or fraud_.

### **Steps to Add the Token to Your Stellar Wallet**

1. **Open Your Stellar Wallet**:
   * [Access your Stellar wallet](https://docs.soroswap.finance/readme/getting-started/choosing-a-wallet) (e.g., [Lobstr Wallet](https://lobstr.co/), [Freighter Wallet](https://www.freighter.app/) , [XBull Wallet](https://xbull.app/), etc.).
2. **Navigate to the Assets or Trustlines Section**:
   * Look for the option to add or manage [trustlines](https://docs.soroswap.finance/01-concepts/trustlines) in your wallet.
3. **Add a New Trustline**:
   * Enter the **Asset Code** (`USDC`).
   * Enter the **Issuer's Public Key** (`GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`).
   * Complete the transaction to set up the trustline. This usually requires a small fee in XLM (Stellar’s native currency) to establish the trustline.
4. **Verify the Token Addition**:
   * After setting up the trustline, you should be able to see the `USDC` token in your wallet. You can receive tokens of this type through transactions or other forms of deposits.

