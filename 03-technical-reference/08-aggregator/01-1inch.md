# Study on the 1inch Aggregator and Its Functioning

**Introduction:**
1inch Network is a decentralized finance (DeFi) aggregator, primarily known for its ability to optimize and route trades across multiple decentralized exchanges (DEXes). This study encompasses the insights and technical aspects of the 1inch Aggregator, particularly focusing on its OneSplit smart contract.

**Understanding 1inch Aggregator:**
- The 1inch Aggregator sources liquidity from various DEXes to provide users with the best possible trading rates. It achieves this by splitting transactions across multiple DEXes, effectively minimizing slippage and maximizing trade efficiency.
- Key to its operation is the OneSplit smart contract, which automates the process of finding the best execution for a trade.

**OneSplit Smart Contract:**
- **Functionality:** OneSplit smart contract is responsible for splitting orders into parts and routing them through the most efficient path. It calculates the expected return for a given trade, considering various factors like liquidity depth and token prices in real-time across different DEXes.
- **Parts and Distribution:** The concept of 'parts' in OneSplit plays a crucial role. It refers to how a trade is divided for execution across DEXes. The contract determines the optimal way to allocate these parts to different DEXes, which is reflected in the distribution array. The OneSplit contract holds a list of DEXes from where it choses where to trade.
- **Execution of Trades:** The standard `swap` method in OneSplit handles multi-step trades, while the `swapMulti` method allows for executing a sequence of distinct swaps in a single transaction.


### OneSplit Flow
**getExpectedReturn:** Everything starts in [here](https://github.com/1inch/1inchProtocol/blob/811f7b69b67d1d9657e3e9c18a2e97f3e2b2b33a/OneSplitAudit.full.sol#L806) it receives `fromToken`, `destToken`, `amount`, `parts`, `flags` you check the flags [here](https://github.com/1inch/1inchProtocol/blob/811f7b69b67d1d9657e3e9c18a2e97f3e2b2b33a/OneSplitAudit.full.sol#L723). this will return and object like this: 
```json
{
  returnAmount: 625685622893,
  distribution: [1,0,0,0,0,0,4,0,0,0]
}
```
as you can see it returns an expected amount and a distribution array, this distribution array is a list of exchanges inside the contract where it can perform the swaps, in this example is suggesting to do 1 swap on exchange #0 and 4 swaps on exchange #6.

To find the best distribution it has a `_findBestDistribution` which receives the `parts` and a matrix of reserves and then returns the distribution //TODO:understand how it finds it

After getting the expected return (which could be done by the front) then you can call the swap function on the contract.

**Swap:** To perform a swap on the aggregator it receives `fromToken`, `destToken`, `amount`, `minReturn`, `distribution`, `flags`. this function can be found [here](https://github.com/1inch/1inchProtocol/blob/811f7b69b67d1d9657e3e9c18a2e97f3e2b2b33a/OneSplit.full.sol#L3782) it gets all the swaps functions, differents for each router/protocol and then loops through the distribution matching the corresponding swap protocol with the amounts, here is a snippet of how it is performing the swap:
```solidity
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
```
reserves[i] is the array with the swap functions for each protocol, in the case of Soroswap this could be an array with [swapSoroswap, swapPhoenix, swapComet] for example. The swap amounts as shown in the snippet is the amount to swap times the corresponding distribution divided by the parts, in the prevoius example this would mean that the OneSplit smart contract is going to perform 2 swaps, in the first exchange it would do 1/5 of the total amount to swap and the second swap would be on the 6th exchange for 4/5 (or the remaining amount) of the total amount.


[1inch Protocol Repository](https://github.com/1inch/1inchProtocol).