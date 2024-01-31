# 1inch Aggregator and Its Functioning

## Introduction
The 1inch Network is a leading player in the decentralized finance (DeFi) space, known for its aggregator service. This aggregator optimizes and routes trades across various decentralized exchanges (DEXes). This document delves into the intricacies and technical elements of the 1inch Aggregator, with a specific focus on the OneSplit smart contract.

## Understanding the 1inch Aggregator
1inch Aggregator stands out for its ability to source liquidity from a multitude of DEXes, ensuring users receive the best possible trading rates. This is achieved by:

- Splitting transactions across several DEXes, thereby reducing slippage and enhancing trade efficiency.
- Utilizing the OneSplit smart contract, which automates the process of securing the most favorable trade execution.

## OneSplit Smart Contract

### Functionality
The OneSplit smart contract is instrumental in dividing orders and routing them through the most advantageous paths. It is responsible for:

- Calculating expected returns for trades, taking into account various dynamics like liquidity depth and real-time token prices across different DEXes.

### Parts and Distribution
- The concept of 'parts' plays a pivotal role in OneSplit. It denotes the division of a trade for execution across different DEXes.
- The contract ascertains the ideal allocation of these parts to various DEXes, reflected in a distribution array. OneSplit maintains a list of DEXes to choose from for executing trades.

### Execution of Trades
- The `swap` method in OneSplit facilitates multi-step trades.
- The `swapMulti` method allows for a sequence of distinct swaps within a single transaction.

### OneSplit Flow

**getExpectedReturn Function:**
- This function is the starting point for calculating returns. It takes parameters such as `fromToken`, `destToken`, `amount`, `parts`, and `flags`. The flags can be reviewed [here](https://github.com/1inch/1inchProtocol/blob/811f7b69b67d1d9657e3e9c18a2e97f3e2b2b33a/OneSplitAudit.full.sol#L723).
- It returns an object comprising the expected return amount and a distribution array. The distribution array indicates the exchanges within the contract for swap execution. For example, a return might look like:
    ```json
    {
      "returnAmount": 625685622893,
      "distribution": [1,0,0,0,0,0,4,0,0,0]
    }
    ```
    This suggests one swap on exchange #0 and the rest 4 parts in one swap on exchange #6.

- The `_findBestDistribution` function, which takes `parts` and a matrix of reserves, is instrumental in determining the best distribution (Note: Understanding this function's operation is pending).

**Swap Function:**
- To execute a swap, the aggregator requires `fromToken`, `destToken`, `amount`, `minReturn`, `distribution`, and `flags`.
- The function, accessible [here](https://github.com/1inch/1inchProtocol/blob/811f7b69b67d1d9657e3e9c18a2e97f3e2b2b33a/OneSplit.full.sol#L3782), aggregates various swap functions specific to each router/protocol.
- The function iterates over the distribution array, matching each protocol's swap function with the allocated amounts. For example, in Soroswap's Aggregator, the array could include [swapSoroswap, swapPhoenix, swapComet].
- The swap amounts are calculated as a fraction of the total amount, proportional to the distribution and divided by the number of parts. For instance, in our example, the contract will execute two swaps: one on the first exchange with 1/5 of the total amount and the second on the 6th exchange with 4/5 (or the remaining amount) of the total amount.

Here is a snippet of the Swap function
```rust
for (uint i = 0; i < distribution.length; i++) {
    if (distribution[i] == 0) {
        continue;
    }

    uint256 swapAmount = amount.mul(distribution[i]).div(parts);
    if (i == lastNonZeroIndex) {
        swapAmount = remainingAmount;
    }
    remainingAmount -= swapAmount;
    reserves[i](fromToken, destToken, swapAmount, flags);
}
``````
[1inch Protocol Repository](https://github.com/1inch/1inchProtocol).