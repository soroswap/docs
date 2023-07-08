# Comparison of Soroswap and UniswapV2 Pair Contracts

The Pair contract written in rust for Soroswap has been inspired in the UniswapV2Pair contract written in Solidity.
However, from the first (0.0.1) version, there are a lot of functions, variables, events and others, that are not currently implemented in SoroswapPairV0.0.1.

In this section we are going to compare the Soroswap pair contract with the UniswapV2 pair contract. We will use the UniswapV2 pair contract as a reference point and argument about
why the Soroswap pair does implement or does not implement certain features.


## Events

The UniswapV2 pair contract has 4 events: Mint, Burn, Swap and Sync.

## Events: Included!
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

TODO!
c.- Swap: We implement as swap in Rust and is essentially the same as in UniswapV2.
d.- Sync: Is used to update the reserves after each change, we call it sync in Rust.

**Included in the code!**
