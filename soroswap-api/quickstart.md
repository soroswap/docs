# Quick Start Guide - Soroswap API Integration

Get your Soroswap API integration running in **under 5 minutes**. This guide is for developers who want to integrate quickly.

## 📚 Documentation Hierarchy

**Choose your path:**
- 🐶 **New to blockchain/Stellar?** → Start with [`beginner-guide.md`](./beginner-guide.md)
- 🎮 **Want to see it working?** → Try [`beginner-example.html`](./beginner-example.html) 
- ⚡ **Experienced developer?** → Continue with this Quick Start
- 📖 **Full API reference?** → See [api.soroswap.finance/docs](https://api.soroswap.finance/docs)

## Prerequisites

- **JavaScript/TypeScript** experience
- **Wallet integration** knowledge (Freighter/StellarWalletsKit)
- **API integration** experience
- **3-5 minutes** of your time

## 🚀 Step 1: Get Your API Key (1 minute)

1. Visit [api.soroswap.finance/login](https://api.soroswap.finance/login)
2. Generate API key (starts with `sk_`)
3. Copy and store securely

### ⚠️ Authentication Format

```javascript
// ✅ CORRECT - Use Bearer authentication
const headers = {
  'Authorization': 'Bearer sk_test_1234567890abcdef',
  'Content-Type': 'application/json'
}

// ❌ WRONG - These will result in 403 Forbidden
const wrongHeaders = {
  'X-API-Key': 'sk_test_1234567890abcdef',    // Wrong header name
  'Authorization': 'sk_test_1234567890abcdef', // Missing 'Bearer'
  'Authorization': 'Bearer sk_expiredApiKey', // Expired key
}
```

## 🔧 Step 2: Environment Setup (2 minutes)

```javascript
const CONFIG = {
    API_BASE_URL: 'https://api.soroswap.finance',  // Production
    // API_BASE_URL: 'https://staging-api.soroswap.finance',  // Staging
    API_KEY: 'sk_your_api_key_here',
    NETWORK: 'testnet', // or 'mainnet'
    
    // Testnet token addresses
    TOKENS: {
        XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',
        USDC: 'CBBHRKEP5M3NUDRISGLJKGHDHX3DA2CN2AZBQY6WLVUJ7VNLGSKBDUCM'
    }
};
```

### Quick Testnet Setup
```bash
# Get testnet XLM
curl "https://friendbot.stellar.org?addr=YOUR_ADDRESS"

# Get test tokens at:
# https://testnet.soroswap.finance/balance
```

## 💱 Step 3: Core Integration (2 minutes)

### Essential API Flow

**4-step process:** Quote → Build → Sign → Send

```javascript
// Minimal swap implementation
class SoroswapClient {
    constructor(apiKey, network = 'testnet') {
        this.apiKey = apiKey;
        this.network = network;
        this.baseUrl = 'https://api.soroswap.finance';
    }

    async apiRequest(endpoint, data) {
        const response = await fetch(`${this.baseUrl}${endpoint}?network=${this.network}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error: ${error.message}`);
        }
        
        return response.json();
    }

    // 1. Get best price quote
    async getQuote(assetIn, assetOut, amount, tradeType = 'EXACT_IN') {
        return this.apiRequest('/quote', {
            assetIn,
            assetOut,
            amount,
            tradeType,
            protocols: ['soroswap', 'phoenix', 'aqua']
        });
    }

    // 2. Build transaction from quote
    async buildTransaction(quote, fromAddress, toAddress = fromAddress) {
        return this.apiRequest('/quote/build', {
            quote,
            from: fromAddress,
            to: toAddress
        });
    }

    // 3. Submit signed transaction
    async sendTransaction(signedXdr, launchtube = false) {
        return this.apiRequest('/send', {
            xdr: signedXdr,
            launchtube
        });
    }
}

// Usage Example
const client = new SoroswapClient('sk_your_api_key');

async function executeSwap() {
    try {
        // 1. Quote
        const quote = await client.getQuote(
            'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // XLM
            'CBBHRKEP5M3NUDRISGLJKGHDHX3DA2CN2AZBQY6WLVUJ7VNLGSKBDUCM', // USDC
            '10000000' // 1 XLM
        );
        
        // 2. Build
        const { xdr } = await client.buildTransaction(quote, userAddress);
        
        // 3. Sign (using your preferred wallet)
        const signedXdr = await signWithWallet(xdr);
        
        // 4. Send
        const result = await client.sendTransaction(signedXdr);
        
        console.log('Swap completed!', result.txHash);
    } catch (error) {
        console.error('Swap failed:', error);
    }
}
```

### Working Examples

📂 **Complete examples available:**
- **[`beginner-example.html`](./beginner-example.html)** - Full interactive tutorial with Freighter integration
- **[`index.html`](./index.html)** - Minimal working example


## 📤 Advanced Options

### Gasless Transactions
```javascript
// For users without XLM for fees
const result = await client.sendTransaction(signedXdr, true);
```

### Custom Transaction Submission
```javascript
// Submit through your own infrastructure
import { Server } from '@stellar/stellar-sdk';

const server = new Server('https://horizon-testnet.stellar.org');
const result = await server.submitTransaction(signedTransaction);
```

### Request Parameters

#### Quote Request
```javascript
{
    assetIn: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC',  // Token selling
    assetOut: 'CBBHRKEP5M3NUDRISGLJKGHDHX3DA2CN2AZBQY6WLVUJ7VNLGSKBDUCM', // Token buying
    amount: '10000000',      // Amount (7 decimals for XLM)
    tradeType: 'EXACT_IN',   // Fixed input amount (most common)
    protocols: ['soroswap', 'phoenix', 'aqua'], // Exclude 'sdex' for smart wallets
    slippageBps: 50         // 0.5% slippage (optional)
}
```

#### Build Request
```javascript
{
    quote: quoteResponse,    // The quote from step 1
    from: userAddress,       // Sender address
    to: userAddress         // Recipient (usually same for swaps)
}
```

#### Send Request
```javascript
{
    xdr: signedXdr,         // Signed transaction XDR
    launchtube: false       // Set true for gasless transactions
}
```

## ❓ Common Issues & Solutions

### "403 Forbidden" errors
1. API key starts with `sk_`
2. Using `Authorization: Bearer <key>` header
3. Using correct base URL (staging vs production)
4. API key hasn't been revoked

### "Insufficient liquidity" 
1. Reduce trade amount
2. Check if pool exists at [app.soroswap.finance](https://app.soroswap.finance)
3. Try different token pairs

### Network mismatch
```javascript
// Ensure these match
const buildUrl = `${API_BASE_URL}/build?network=testnet`;
```

### Expected Response Times
- `/quote`: 1-3 seconds
- `/build`: 2-5 seconds  
- `/send`: 3-10 seconds

## 🚨 Production Considerations

### Security
- Never expose API keys in frontend code for production
- Use environment variables for sensitive data
- Implement proper error handling and retry logic

### Performance
- Add request timeouts (30s recommended)
- Implement exponential backoff for retries
- Cache quotes for better UX (but respect freshness)

### Monitoring
- Track transaction success rates
- Monitor API response times
- Log error patterns for debugging

## 🎯 Next Steps

1. **Explore full API**: [api.soroswap.finance/docs](https://api.soroswap.finance/docs)
2. **Add error handling**: Implement retry logic and user feedback
3. **Production optimization**: Proper state management and caching
4. **Multi-token support**: Beyond just XLM→USDC swaps

## 📚 Additional Resources

- **🔗 API Documentation**: [api.soroswap.finance/docs](https://api.soroswap.finance/docs)
- **🌍 Stellar Expert (Testnet)**: https://stellar.expert/explorer/testnet
- **🏦 Soroswap Interface**: https://app.soroswap.finance
- **💬 Discord Support**: https://discord.gg/soroswap

🎉 **Ready to build?** You now have everything needed for a production-ready Soroswap integration!