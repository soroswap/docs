# The Router Contract: Comparison between Soroswap and UniswapV2

Until now, we have developed the Factory and the Pair contract. The factory knows how many pairs it has created and can give us their contract addresses. Also, if we want to trade between token A and token B, and if that pair exists, the Factory will also give us the corresponding pair contract address.

But what happens if there are two pairs, A-B and B-C, and a user wants to make a trade between A and C? We could first trade A to B and then B to C! This is why we have the Router Contract.

The Router Contract allows swapping of tokens when a direct pair does not exist. It also handles liquidity provision and manages deposit and withdrawal functions for liquidity providers within the Soroswap ecosystem.

# The native token: ETH, WETH, and XLM.

In the `UniswapV2Router02`, there is a very important distinction between any ERC20 tokens and the native token ETH (and its wrapped version WETH). In particular, in the contract we find:

```javascript
address public immutable override WETH;
```
With UniswapV2Router02, if you are using ETH, you'll need to use special functions:

- `addLiquidityETH` instead of `addLiquidity`
- `removeLiquidityETH` instead of `removeLiquidity`
- `removeLiquidityETHWithPermit` instead of `removeLiquidityWithPermit`
- Instead of just having `swapExactTokensForTokens` and `swapTokensForExactTokens`; Uniswap Router needs to add 4 extra functions: `swapExactETHForTokens`, `swapTokensForExactETH`, 
`swapExactTokensForETH`, `swapETHForExactTokens`.
- Instead of just having `swapExactTokensForTokensSupportingFeeOnTransferTokens`, Uniswap Router needs to add 2 extra functions: `swapExactETHForTokensSupportingFeeOnTransferTokens` and `swapExactTokensForETHSupportingFeeOnTransferTokens`


This is because it's very common that in Blockchains, the native token (in this case ETH in Ethereum) is treated differently, so the smart contract needs to trigger different functions when transferring the native token.

**What about in Soroban?**

Well, in Soroban, we won't need to have all these extra functions! This is because the native XML token has its own token contract address and can be treated as any other token complying with the token interface.

You can find more information about this in the Soroban Token Playground Chapter 8, 9, 10, and 11.

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

Also, because we will treat XML as any other token, we won't need to define its address. We won't need to write something like:

```javascript
address public immutable override WETH;
```

Finally, there is also no need for this function:

```javascript
receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }
```
as XML can only be sent using the native contract.


# SafeMath

In Solidity, the SafeMath library is used to validate arithmetic operations and prevent integer overflow/underflow. Should such a situation arise, the library throws an exception, which effectively reverts the transaction.

In Rust, we can achieve similar functionality by activating the overflow check flag during the compilation process with the following code:

```toml
[profile.release]
overflow-checks = true

```

Additionally, we use an overflow-safe implementation of functions `checked_add`, `checked_mul`, `checked_div`, and `checked_sub`. You can explore these functions and test their functionality in this repository:  [Overflow Soroban Repository](https://github.com/esteblock/overflow-soroban/)

Also, we have overflow-safe functions `checked_add`, `checked_mul`, `checked_div` and `checked_sub`

You can check and test these techniques in the following repository: [Overflow Soroban Repository](https://github.com/esteblock/overflow-soroban/)

In conclusion, Soroswap prevents overflows by leveraging these techniques.

# Deadlines
In Ethereum we can send a transaction with low gas price, and that transaction could be accepted 5, 10 or more minutes later. In order to avoid unwanted transactions after a period of time, Uniswap introduces the `deadline` parameter and the `ensure(deadline)` modifier:

```javascript
modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');
        _;
    }
```

In Soroban, we can think that having a transaction waiting for minutes is something that can never happen. But because we don't want to say **never**, Soroswap will include this "deadline modifier."

Modifiers do not currently exist in the `soroban-sdk`. So we'll need to build a special function using the `env.ledger().timestamp()` object.


# Permit
In `UniswapV2Router02` we use the `permit` method of the `UniswapV2ERC20.sol` contracts that is defined [here](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2ERC20.sol):

```javascript
 function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        require(deadline >= block.timestamp, 'UniswapV2: EXPIRED');
        bytes32 digest = keccak256(
            abi.encodePacked(
                '\x19\x01',
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline))
            ) 
        );
        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress != address(0) && recoveredAddress == owner, 'UniswapV2: INVALID_SIGNATURE');
        _approve(owner, spender, value);
    }
```

This function implements [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612). This avoids the user to use 2 transactions `approve` and `transfer, which allows users to modify the allowance mapping using a signed message. this function allows a token holder to grant permission for a specific address (spender) to spend their tokens up to a certain amount (value) with a specified expiration time (deadline). The signature ensures the authenticity of the permit, and the function enforces that the permit hasn't expired and that it was signed by the legitimate token owner.

In Soroban we don't need to implement something like this, as we use the `require.auth()` method when sending tokens from the user into the smart contract.

**Conclusion:** We don't need to impement the `removeLiquidityWithPermit`, neither the `removeLiquidityETHWithPermit` functions (neither `removeLiquidityETHWithPermitSupportingFeeOnTransferTokens`)


# Fees on Transfer

In UniswapV2, there is a special function that allows the user to swap tokens that charge a fee when doing a transfer. This tokens are popular in the **deflactionist community**, and indeed it made Uniswap upgrade their original [UniswapV2Router](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router01.sol) (latter called UniswapV2Router01) contract to a [UniswapV2Router02](https://github.com/Uniswap/v2-periphery/blob/master/contracts/UniswapV2Router02.sol) version!

You can read all the discussion of the Uniswap design in [this issue](https://github.com/Uniswap/interface/issues/835)


In the code we see many functions that have the word `SupportingFeeOnTransferTokens`:

- `_swapSupportingFeeOnTransferTokens`
- `swapExactTokensForTokensSupportingFeeOnTransferTokens`
- `swapExactETHForTokensSupportingFeeOnTransferTokens`
- `swapExactTokensForETHSupportingFeeOnTransferTokens`
- `removeLiquidityETHSupportingFeeOnTransferTokens`

But in fact there is only two functions that do all the work: `_swapSupportingFeeOnTransferTokens` and `removeLiquidityETHSupportingFeeOnTransferTokens`

These functions work equal to `_swap` and `removeLiquidityETH` but succeeds for tokens that take a fee on transfer.

Because in Soroswap we want to support all types of tokens, we will implement these logics in the SoroswapRouter contract!

# library UniswapV2Library
UniswapV2Router uses the UniswapV2Library. This is something that Soroswap will also develop

# What's next?
Write rust!
