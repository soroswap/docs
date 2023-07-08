# Comparison of Soroswap and UniswapV2 Pair Contracts

The Pair contract written in rust for Soroswap has been inspired in the UniswapV2Pair contract written in Solidity.
However, from the first (0.0.1) version, there are a lot of functions, variables, events and others, that are not currently implemented in SoroswapPairV0.0.1.

In this section we are going to compare the Soroswap pair contract with the UniswapV2 pair contract. We will use the UniswapV2 pair contract as a reference point and argument about
why the Soroswap pair does implement or does not implement certain features.



## Events: Included!
The UniswapV2 pair contract has 4 events: Mint, Burn, Swap and Sync.
The corresponding events in the Soroswap pair contract are: deposit, withdraw, swap and sync.

```javascript
 event Mint(address indexed sender, uint amount0, uint amount1);
 event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
 event Swap(
     address indexed sender,
     uint amount0In,
     uint amount1In,
     uint amount0Out,
     uint amount1Out,
     address indexed to 
 );
 event Sync(uint112 reserve0, uint112 reserve1);
```
a.- As `Mint` already exist as an event in the SAC token interface, we will choose something else.
Context: In Ethereum, the ERC20 does emit an `Transfer` event when minting a token:
https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol

Also, `Mint` it's not the best name for this event, as the arguments are `amount0` and  `amount1`.
A best name for this event is `Deposit`. Also because the user deposits amount0 units of token0 token, and amount1 units of token1 tokens.
Also, we don't need to track again the minted tokens, as the `Mint` (LP units of LP tokens) it is already being emited.

Conclusion: We will use `deposit` as a event.

b.- The same thing with `Burn`. We will use `withdraw`
Also, in soroban there is no use of msg.sender, so the event implementation will be:
events::withdraw(&e, to, out_a, out_b, to)
why? To easily implement / transform Uniswap SDK's

[]: # (TODO: review c and d)
c.- Swap: We implement as swap in Rust and is essentially the same as in UniswapV2.
d.- Sync: Is used to update the reserves after each change, we call it sync in Rust.

**Included in the code!**

___
___


## SafeMath: Included!
In Solidity: The SafeMath library validates if an arithmetic operation would result in an integer overflow/underflow. If it would, the library throws an exception, effectively reverting the transaction.

In Rust we can throw a panic by activating the [overflow check](https://doc.rust-lang.org/rustc/codegen-options/index.html#overflow-checks) flag with
```
[profile.release]
overflow-checks = true
```
when compilling the code.

Also we have overflow-safe functions `checked_add`, `checked_mul`, `checked_div` and `checked_sub`

You can check and test these tecniques in the following repo: https://github.com/esteblock/overflow-soroban/

Conclusion: Soroswap will implement all of the tecniques above

___
However, as we are using i128, that is signed integers, underflow won't happen... instead we will have negative numbers.
Hence, this kind of checks there put in place when needed:
```rust
fn put_reserve_a(e: &Env, amount: i128) {
    if amount < 0 {
        panic!("put_reserve_a: amount cannot be negative")
    }
    e.storage().set(&DataKey::Reserve0, &amount)
}
```
**Included in the code!**
