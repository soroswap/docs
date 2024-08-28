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
The `parts` input indicates how many parts the trade should be split into, and the `distribution` array shows the allocation of these parts across different DEXes. The `returnAmount` represents the expected return for the trade.

as you can see it returns an expected amount and a distribution array, this distribution array is a list of exchanges inside the contract where it can perform the swaps, in this example is suggesting to swap 1 part on exchange #0 and 4 parts on exchange #6, 5 parts in total. 

To find the best distribution it has a `_findBestDistribution` function which receives the `parts` and a matrix of expected amounts and then returns the distribution. 
This Matrix is built calculating the expected return for each exchange and each accumulated parts. For example: `matrix[i][j]` is the expected return of using exchange `i` with `j` parts minus gas.

This matrix is build using an array of functions. Which could be tricky to understand:
```solidity
    function(IERC20,IERC20,uint256,uint256,uint256) view returns(uint256[] memory, uint256)[DEXES_COUNT] memory reserves = _getAllReserves(flags);
```
The function `_getAllReserves(flags)` returns an array of functions, each function is a calculate function for a different protocol, for example, the array could be `[calculateUniswap, calculateBancor, ... , calculateOasis]`.

**_findBestDristribution:** This function is responsible for finding the best distribution of the parts, it receives the `parts` and a matrix of expected amounts.
it builds two arrays, answer and parent. First, the answer array stores the expected return of exchange and parts combinations. For example, `answer[i][j]` stores the best expected amount using `j` parts, which could be swapping `j-k` for one (or multiple) exchange and `k` for the exchange `i`. Second, the parent array stores the number of parts that are left to use in another exchange.
The answer array is a matrix of `int[n][s+1]` and the parent array is a matrix of `uint[n][s+1]` where `n` is the number of exchanges and `s` is the number of parts.
```solidity
        int256[][] memory answer = new int256[][](n); // int[n][s+1]
        uint256[][] memory parent = new uint256[][](n); // int[n][s+1]
```
The inizialization of the arrays looks like:
```solidity        
for (uint j = 0; j <= s; j++) {
    answer[0][j] = amounts[0][j];
    for (uint i = 1; i < n; i++) {
        answer[i][j] = -1e72;
    }
    parent[0][j] = 0;
}
```
Which means that the expected return for the first exchange is the expected return of using the first exchange with `j` parts, and the expected return for the rest of the exchanges is -1e72 (a very low number) and the parent for the first exchange is 0.

The main part of the algorithm is here:
```solidity
        for (uint i = 1; i < n; i++) {
            for (uint j = 0; j <= s; j++) {
                answer[i][j] = answer[i - 1][j];
                parent[i][j] = j;

                for (uint k = 1; k <= j; k++) {
                    if (answer[i - 1][j - k] + amounts[i][k] > answer[i][j]) {
                        answer[i][j] = answer[i - 1][j - k] + amounts[i][k];
                        parent[i][j] = j - k;
                    }
                }
            }
        }
```
Here, first it initializes the answer and parent arrays with the expected return of using the first exchange with `j` parts and the parent for the first exchange is `j`. Then it loops through the rest of the exchanges and parts, checking if the expected return of using one exchange with `j` parts is greater than the expected return of using the previous exchange with `j` parts, if it is then it updates the answer and parent arrays with the new expected return and the new parent.

Finally, it returns the distribution and the expected return:
```solidity
        distribution = new uint256[](DEXES_COUNT);

        uint256 partsLeft = s;
        for (uint curExchange = n - 1; partsLeft > 0; curExchange--) {
            distribution[curExchange] = partsLeft - parent[curExchange][partsLeft];
            partsLeft = parent[curExchange][partsLeft];
        }

        returnAmount = (answer[n - 1][s] == VERY_NEGATIVE_VALUE) ? 0 : answer[n - 1][s];
```


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