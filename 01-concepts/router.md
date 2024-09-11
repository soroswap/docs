# Router

The [**Router** in Soroswap Finance ](https://github.com/soroswap/soroswap-router-sdk)is a key component of the protocol that facilitates interactions with multiple [**Liquidity Pools**.](https://docs.soroswap.finance/01-concepts/02-pools) Liquidity Pools are always formed between two tokens, creating what are known as **Pairs**. For example, a pool might be between Token A and Token B, forming the pair **A:B**.

### Router Function

The Router allows for swaps between two tokens, even if there is no direct pair between them. This is where the Router's flexibility comes into play. Instead of performing a direct swap between Token A and Token C, the Router can find the best route using one or more intermediate pairs. For example:

* **Direct Route:** If a direct pair **A:C** exists, the Router can perform the swap directly between A and C.
* **Indirect Route:** If no direct pair is available, the Router can use a multi-hop route, such as **A:B** followed by **B:C**.

### How It Works

1. **Retrieve Pools:** The Router first retrieves data on all available pools involving the tokens you wish to swap. This data is sourced from the backend database.
2. **Calculate Routes:** Using the pool data, the Router calculates all possible routes for the swap, considering a maximum number of hops allowed between pairs.
3. **Optimize Route:** The Router breaks down possible routes into segments and calculates the optimal swap for each segment. It then combines these routes and validates which offers the best overall exchange rate.
4. **Execute Swap:** Finally, the Router selects the best route based on the amount of tokens to be received or sent and executes the swap.

### [Router Methods](https://docs.soroswap.finance/soroswap-router-sdk/07-optimal-route/01-soroswap-router-sdk)

The Router provides two main methods:

* **`getPools(tokenIn, tokenOut)`**: Retrieves information on available pools that include the specified tokens.
* **`getBestRoute(tokenIn, tokenOut, TradeType, ...options)`**: Calculates and returns the best route for the swap between the specified tokens, considering trade type and additional options.

### Token Validation

To ensure security, the Router uses a list of known and validated tokens. This prevents the use of malicious tokens in swap routes. Tokens used in a transaction are checked against this list to ensure they are reliable.

