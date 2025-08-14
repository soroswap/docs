# 🚀 Soroswap Integration Guide for Beginners

## 📖 What You'll Learn

This guide teaches you how to integrate Soroswap API into your application using:
- **Freighter Wallet** for secure wallet connection and transaction signing
- **Soroswap API** for finding the best swap routes and transaction submission

## 🎯 Prerequisites

Before starting, make sure you have:
- Basic knowledge of **HTML, CSS, and JavaScript**
- **Freighter Wallet** extension installed
- An **API key** from Soroswap sign up at [https://api.soroswap.finance/login](https://api.soroswap.finance/login)
- A **web browser** with developer tools
- **5-10 minutes** of focused time

## 🏗️ Project Structure Overview

Our swap application consists of **6 main parts**:

```
1. HTML Structure     → User interface elements with professional styling
2. External Libraries → Freighter API for wallet integration  
3. Configuration     → Centralized CONFIG object with all settings
4. Application State  → Tracks wallet connection and transaction status
5. Utility Functions  → Helper functions for UI updates and API calls
6. Core Functions    → Connect, Quote, Sign, and Send (4 separate steps)
```

Since this guide is to use the api, we'll focus on the **core functions** that make the swap happen.

## 🔧 Core Functions Explained

### Function 1: Connect to Wallet 🔗

```javascript
async function connectStellarWallet() {
    // Step 1: Check if Freighter wallet is installed
    const hasFreighter = await freighter.isConnected();
    console.log('Freighter connected:', hasFreighter);
    
    // Step 2: If not installed, show error message
    if (!hasFreighter.isConnected) {
        alert('Please install the Freighter wallet extension first.');
        return; // Stop function execution
    }
    
    // Step 3: Request permission to connect
    console.log('Connecting to Freighter...');
    account = await freighter.requestAccess();
    account = account.address; // Extract just the address
    
    // Step 4: Update the user interface
    connectButton.disabled = true; // Disable connect button
    document.getElementById('account').innerText = `Connected account: ${account}`;
}
```

**🔍 What this function does:**
1. **Checks** if Freighter wallet is available
2. **Requests** permission to access the wallet
3. **Stores** the wallet address for later use
4. **Updates** the UI to show connection status

**🚨 Common issues:**
- User doesn't have Freighter installed → Show installation instructions
- User denies permission → Ask them to try again

### Function 2: Get Quote and Build Transaction 💱

```javascript
async function getQuote() {
    try {
        // Make sure wallet is connected
        if (!appState.connected) {
            updateStatus('❌ Please connect your wallet first!', 'error');
            return;
        }

        // PHASE 1: Get Quote
        updateStatus('🔄 Getting best price from exchanges...', 'info');
        
        const quoteRequest = {
            assetIn: CONFIG.TOKENS.XLM,         // What we're selling
            assetOut: CONFIG.TOKENS.USDC,       // What we want to buy
            amount: CONFIG.TRADE.AMOUNT,        // How much we're selling
            tradeType: CONFIG.TRADE.TYPE,       // Exact input amount
            protocols: CONFIG.TRADE.PROTOCOLS   // Which exchanges to check
        };

        appState.currentQuote = await makeAPIRequest('/quote', quoteRequest);
        const outputAmount = formatAmount(appState.currentQuote.amountOut, 7); // USDC has 7 decimals

        updateStatus(`✅ Quote received: ${outputAmount} USDC for 1 XLM<br>🔄 Building transaction...`, 'info');

        // PHASE 2: Build Transaction
        const buildRequest = {
            quote: appState.currentQuote,       // Use the quote we just got
            from: appState.walletAddress,       // Who's sending
            to: appState.walletAddress          // Who's receiving (same person in a swap)
        };

        const buildResult = await makeAPIRequest('/quote/build', buildRequest);
        appState.unsignedXdr = buildResult.xdr;
        
        // Show the unsigned transaction for educational purposes
        ELEMENTS.unsignedXdr.value = buildResult.xdr;
        ELEMENTS.technicalDetails.classList.remove('hidden');

        updateStatus(`✅ Transaction built successfully!<br>⏳ Ready for signing...`, 'info');
        updateButtonStates();
    } catch (error) {
        console.error('Quote process failed:', error);
        updateStatus(`❌ Process failed: ${error.message}`, 'error');
    }
}
```

**🔍 What this function does:**
1. **Validates** wallet connection first
2. **Requests** the best price from multiple exchanges
3. **Builds** a transaction based on that price
4. **Prepares** the transaction for signing (stores in app state)
5. **Updates** the UI to enable the next step

**🚨 Common issues:**
- Wallet not connected → Connect wallet first
- API key expired → Get a new one from dashboard
- Insufficient balance → Make sure wallet has enough XLM

### Function 3: Sign the Transaction ✍️

```javascript
async function signTransaction() {
    try {
        // Make sure wallet is connected and we have a transaction to sign
        if (!appState.connected) {
            updateStatus('❌ Please connect your wallet first!', 'error');
            return;
        }
        
        if (!appState.unsignedXdr) {
            updateStatus('❌ No transaction to sign. Please get a quote first!', 'error');
            return;
        }

        updateStatus('📝 Please approve the transaction in Freighter...', 'info');

        // Sign the transaction using Freighter
        const signResult = await freighterAPI.signTransaction(appState.unsignedXdr, {
            network: CONFIG.NETWORK,
            networkPassphrase: 'Test SDF Network ; September 2015',
            address: appState.walletAddress
        });

        appState.signedTransaction = signResult.signedTxXdr;
        
        // Show the signed transaction for educational purposes
        ELEMENTS.signedXdr.value = appState.signedTransaction;
        
        const outputAmount = formatAmount(appState.currentQuote.amountOut, 6);
        updateStatus(`✅ Transaction signed successfully!<br>📋 Ready to swap 1 XLM for ${outputAmount} USDC`, 'success');
        updateButtonStates();
    } catch (error) {
        console.error('Transaction signing failed:', error);
        updateStatus(`❌ Transaction signing failed: ${error.message}`, 'error');
    }
}
```

**🔍 What this function does:**
1. **Validates** wallet connection and transaction availability
2. **Calls** Freighter to sign the transaction
3. **Stores** the signed transaction in app state
4. **Updates** UI to enable final step

**🚨 Common issues:**
- User rejects signing → Ask them to try again
- Freighter not connected → Check wallet connection
- Wrong network → Ensure Freighter is on testnet

### Function 4: Send Transaction to Network 🚀

```javascript
async function sendTransaction() {
    try {
        // Make sure we have a signed transaction
        if (!appState.signedTransaction) {
            updateStatus('❌ No signed transaction available. Please get a quote and sign it first.', 'error');
            return;
        }

        updateStatus('🚀 Broadcasting transaction to Stellar network...', 'info');

        // Send the signed transaction
        const sendRequest = {
            xdr: appState.signedTransaction,    // The signed transaction
            launchtube: false                   // Use normal fees (not gasless)
        };

        const sendResult = await makeAPIRequest('/send', sendRequest);

        // Create link to view transaction on Stellar Expert
        const explorerUrl = `https://stellar.expert/explorer/${CONFIG.NETWORK}/tx/${sendResult.txHash}`;
        
        // Show success message
        ELEMENTS.transactionLink.innerHTML = `
            <strong>Transaction Hash:</strong> <code>${sendResult.txHash}</code><br>
            <a href="${explorerUrl}" target="_blank" rel="noopener">🔗 View on Stellar Expert</a>
        `;
        ELEMENTS.finalResults.classList.remove('hidden');

        updateStatus('🎉 Swap completed successfully! Check the transaction link above.', 'success');

        // Reset state for potential next transaction
        appState.unsignedXdr = null;
        appState.signedTransaction = null;
        appState.currentQuote = null;
        updateButtonStates();

    } catch (error) {
        console.error('Transaction send failed:', error);
        updateStatus(`❌ Transaction failed: ${error.message}`, 'error');
    }
}
```

**🔍 What this function does:**
1. **Validates** we have a signed transaction ready
2. **Submits** the transaction to the Stellar network via Soroswap API
3. **Shows** success message with transaction hash and explorer link
4. **Resets** state for potential next transaction

## 🔄 Complete Workflow Summary

**4-Step Process:**

```
🔗 STEP 1: Connect Wallet
User clicks "Connect Freighter Wallet"
   ↓ connectWallet() function
App connects to Freighter wallet ✅
   ↓

💱 STEP 2: Get Quote & Build Transaction
User clicks "Quote & Build (1 XLM → USDC)"
   ↓ getQuote() function
App gets best price + builds unsigned transaction ✅
   ↓

✍️ STEP 3: Sign Transaction
User clicks "Sign Transaction"
   ↓ signTransaction() function
User approves transaction in Freighter wallet ✅
   ↓

🚀 STEP 4: Send to Network
User clicks "Send Transaction"
   ↓ sendTransaction() function
App broadcasts to Stellar network ✅
   ↓
🎉 SWAP COMPLETE!
```

## 🛠️ Key Concepts for Beginners

### What is XDR?
**XDR** (External Data Representation) is how Stellar transactions are encoded:
- **Unsigned XDR**: Transaction ready to be signed
- **Signed XDR**: Transaction with digital signature, ready to submit

### What is a Quote?
A **quote** tells you:
- How much you'll receive for your trade
- Which exchanges offer the best price
- What path the trade will take

### What is Signing?
**Signing** a transaction means:
- Proving you own the wallet
- Authorizing the transaction
- Making it ready for the network

## 🚨 Security Best Practices

### ✅ DO:
- Use testnet for learning and testing
- Keep your API keys secure
- Verify transaction details before signing
- Start with small amounts

### ❌ DON'T:
- Put API keys in public code repositories
- Sign transactions you don't understand
- Use mainnet while learning
- Hardcode private keys (never!)

## 🔧 Common Troubleshooting

### Problem: "Freighter not found"
**Solution**: Install Freighter wallet extension

### Problem: "403 Forbidden" error
**Solution**: Check your API key is correct and not expired

### Problem: "Insufficient liquidity"
**Solution**: Try a smaller amount or different token pair

### Problem: Transaction fails
**Solution**: Check you have enough XLM for fees

## 🎓 Next Steps

Once you understand this basic example:

1. **Customize the UI** with better styling
2. **Add error handling** for better user experience  
3. **Support multiple tokens** instead of just XLM→USDC
4. **Add slippage protection** for price changes
5. **Try new methods** from [Soroswap API](https;//api.soroswap.finance/docs)
4. **Experiment using the SDK**

## 📚 Additional Resources

- **Soroswap API Docs**: https://api.soroswap.finance/docs
- **Freighter Docs**: https://freighter.app/docs
- **Stellar Docs**: https://developers.stellar.org
- **Stellar Expert**: https://stellar.expert (blockchain explorer)

## 💡 Pro Tips

1. **Use browser dev tools** to debug API calls
2. **Check the console** for error messages
3. **Read API responses** to understand what's happening
