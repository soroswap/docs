# The Router Contract: Comparison between Soroswap and UniswapV2
Until now, we have developed the Factory and the Pair contract. The factory knows how many pairs it has created and can give us their contract addresses. Also, if we want to trade between token A and token B, and if that pair exist, the Factory will also give us the corresponding pair contract address.

But what happens if there are two pairs, A-B and B-C, and a user want's to make a trade between A and C? We could first trade A to B and then B to C! This why we have the Router Contract.

The Router Contract allows swap of tokens when a direct pair does not exist. It also handles liquidity provision and manage deposit and withdrawal functions for liquidity providers within the Soroswap ecosystem.


# The native token: ETH, WETH and XLM.
In the `UniswapV2Router02` there is a very important distinct between any ERC20 tokens and the native token ETH (and it's wrapped version WETH). In particular, in the contract we find:

```javascript
address public immutable override WETH;
```
With `UniswapV2Router02` if you are using ETH, you'll need to use special functions:

- `addLiquidityETH` instead of `addLiquidity`
- `removeLiquidityETH` instead of `removeLiquidity`
- `removeLiquidityETHWithPermit` instead of `removeLiquidityWithPermit`
- Instead of just having `swapExactTokensForTokens` and `swapTokensForExactTokens`; Uniswap Router needs to add 4 extra functions: `swapExactETHForTokens`, `swapTokensForExactETH`, 
`swapExactTokensForETH`, `swapETHForExactTokens`.
- Instead of just having `swapExactTokensForTokensSupportingFeeOnTransferTokens`, Uniswap Router needs to add 2 extra functions: `swapExactETHForTokensSupportingFeeOnTransferTokens` and `swapExactTokensForETHSupportingFeeOnTransferTokens`


This is because it's very common that in Blockchains, the native token (in this case ETH in Ethereum) it's treated differently, so the smart contract needs to trigger different functions when transfering the native token.

**What about in Soroban?:**  Well, in Soroban we won't need to have all this extra functions! This is because the natibe XML token it has it's own token contract address and can be treated as any other token compying with the token interface.

You can find more information about this in the Soroban Token Playground Chapter 8, 9, 10 and 11

**Conclusion:**
Only the following functions will be written:
```javascript
function addLiquidity
function removeLiquidityWithPermit
function swapExactTokensForTokens
function swapTokensForExactTokens
function swapExactTokensForTokensSupportingFeeOnTransferTokens

```
The following functions won't be written:

```javascript
function addLiquidityETH
function removeLiquidityETH
function removeLiquidityETHWithPermit
function swapExactETHForTokens
function swapTokensForExactETH
function swapExactTokensForETH
function swapETHForExactTokens
function swapExactETHForTokensSupportingFeeOnTransferTokens
function swapExactTokensForETHSupportingFeeOnTransferTokens
```

Also, because we will treat XML as any other token, we won't need to define it's address. We won't need to write something like:

```javascript
address public immutable override WETH;
```

Finally, there is also no need of this function:

```javascript
receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }
```
as XML can oly be sent using the native contract.

# SafeMath:
In Solidity, the SafeMath library is used to validate arithmetic operations and prevent integer overflow/underflow. 
Should such a situation arise, the library throws an exception, which effectively reverts the transaction.

In Rust, we can achieve similar functionality by activating the overflow check flag with the following code during the 
compilation process:

In Rust, we can achieve a similar level of protection by enabling the [overflow check](https://doc.rust-lang.org/rustc/codegen-optionsindex.html#overflow-checks) 

flag during the compilation process with the following code:
```
[profile.release]
overflow-checks = true
```

Additionally, we use an overflow-safe implementation of functions `checked_add`, `checked_mul`, `checked_div`, and `
checked_sub`. You can explore these functions and test their functionality in this repository: (https://github.com/esteblock/overflow-soroban/)

Also we have overflow-safe functions `checked_add`, `checked_mul`, `checked_div` and `checked_sub`

You can check and test these tecniques in the following repo: https://github.com/esteblock/overflow-soroban/

In conclusion, Soroswap prevents overflows by leveraging these techniques.

# deadline
In Ethereum we can send a transaction with low gas price, and that transaction could be accepted 5, 10 or more minutes later. In order to avoid unwanted transactions after a period of time, Uniswap introduces the `deadline` parameter and the `wensure(deadline)` modifier:

```
modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');
        _;
    }
```

In Soroban we can think that having a transaction waiting for minutes is something that can never happen. But because we don't want to say **never**, Soroswap does includes this "deadline modifier".

Modifiers do not currently exist in the `soroban-sdk`. So we'll need to build an spefial function using the `env.ledger().timestamp()` object.

# permit
In `UniswapV2Router02` we have some interesting functions that use the `permit`




```
removeLiquidityETHWithPermitSupportingFeeOnTransferTokens
    function removeLiquidityETHSupportingFeeOnTransferTokens(

```
Let's analize UniswapV2 Router Contract:
```javascript
using SafeMath for uint;
address public immutable override factory;
address public immutable override WETH;
```

