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
<https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol>

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
However, as we are using i128, that is a signed integer type, underflow won't happen... instead we will have negative numbers.
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

___
___

## Reentrancy Guards: Not implemented for the moment
```javascript
    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'UniswapV2: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }
```

Currently, reentrancy it's not allowed:
Check here: <https://github.com/esteblock/reentrancy-soroban>  
And here: <https://discord.com/channels/897514728459468821/993874836336152576>  

We will need to come back to this later if reentrancy will be allowed

**status: Not implemented for the moment**

## Oracles  

To be written

## Reserves Function: included!
In UniswapV2: The reserves function returns the reserves of token0 and token1, and the last block timestamp.
```javascript
 function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
     _reserve0 = reserve0;
     _reserve1 = reserve1;
     _blockTimestampLast = blockTimestampLast;
 }
 ```

In Soroswap:  this is implemented in `get_reserves`.


 ```rust
   fn get_reserves(e: Env) -> (i128, i128, i128) {
        (get_reserve_a(&e), get_reserve_b(&e), get_block_timestamp_last(&e))
    }

fn get_reserve_0(e: &Env) -> i128 {
    e.storage().get_unchecked(&DataKey::Reserve0).unwrap()
}

fn get_reserve_1(e: &Env) -> i128 {
    e.storage().get_unchecked(&DataKey::Reserve1).unwrap()
}
 ```
The `get_block_timestamp_last` function returns the last block timestamp, or 0 if does not exist.
 ```rust
fn get_block_timestamp_last(e: &Env) -> u64 {
 
    if let Some(block_timestamp_last) = e.storage().get(&DataKey::BlockTimestampLast) {
        block_timestamp_last.unwrap()
    } else {
        0
    }
}
 ```
 

Included in the code!

 ## Name of Pairs: included!

In UniswapV2:
``` javascript
string public constant name = 'Uniswap V2';
string public constant symbol = 'UNI-V2';
```

Implemented in Soroswap:

``` rust
Bytes::from_slice(&e, b"Soroswap Pair Token"),
Bytes::from_slice(&e, b"SOROSWAP-LP"),
```

Included in the code!

___
___

## Protocol fee: Mint Fee: included!
Uniswap v2 includes a 0.05% protocol fee that can be turned on and off. If turned on,
this fee would be sent to a feeTo address specified in the factory contract.
Initially, feeTo is not set, and no fee is collected. A pre-specified address—feeToSetter—can
call the setFeeTo function on the Uniswap v2 factory contract, setting feeTo to a different
value. feeToSetter can also call the setFeeToSetter to change the feeToSetter address
itself.

```javascript
uint public constant MINIMUM_LIQUIDITY = 10**3;
uint public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

 // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IUniswapV2Factory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint rootK = Math.sqrt(uint(_reserve0).mul(_reserve1));
                uint rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint numerator = totalSupply.mul(rootK.sub(rootKLast));
                    uint denominator = rootK.mul(5).add(rootKLast);
                    uint liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }
```

The equivalent code in Soroswap is:


```rust
fn mint_fee(e: &Env, reserve_0: i128, reserve_1: i128) -> bool{
    let factory = get_factory(&e);
    let factory_client = FactoryClient::new(&e, &factory);
    //  address feeTo = IUniswapV2Factory(factory).feeTo();
    //  feeOn = feeTo != address(0);
    let fee_on = factory_client.fees_enabled();
    let klast = get_klast(&e);
     
    if fee_on{
        let fee_to: Address = factory_client.fee_to();

        if klast != 0 {
            let root_k = (reserve_0.checked_mul(reserve_1).unwrap()).sqrt();
            let root_klast = (klast).sqrt();
            if root_k > root_klast{
                // uint numerator = totalSupply.mul(rootK.sub(rootKLast));
                let total_shares = get_total_shares(&e);
                let numerator = total_shares.checked_mul(root_k.checked_sub(root_klast).unwrap()).unwrap();
        
                // uint denominator = rootK.mul(5).add(rootKLast);
                let denominator = root_k.checked_mul(5_i128).unwrap().checked_add(root_klast).unwrap();
                // uint liquidity = numerator / denominator;

                let liquidity_pool_shares_fees = numerator.checked_div(denominator).unwrap();

                // if (liquidity > 0) _mint(feeTo, liquidity);
                if liquidity_pool_shares_fees > 0 {
                    mint_shares(&e, fee_to,    liquidity_pool_shares_fees);
                }
            }
        }
    } else if klast != 0{
        put_klast(&e, 0);
    }

    fee_on
}
```
where we can see that we used the checked_add, checked_sub, checked_mult and checked_div functions to avoid overflow.

