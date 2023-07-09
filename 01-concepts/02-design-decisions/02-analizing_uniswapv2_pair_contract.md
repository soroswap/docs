# Comparison of Soroswap and UniswapV2 Pair Contracts: Part 1
The sources for the following 2 sections are:

- <https://blog.uniswap.org/uniswap-v2>  
- <https://rskswap.com/audit.html>

The Pair contract for Soroswap, written in Rust, is inspired by the UniswapV2Pair contract, which is written in Solidity. However, in its first version (0.0.1), the SoroswapPairV0.0.1 does not currently implement many functions, variables, events, and other features that are present in the UniswapV2Pair contract.

In the next two sections, we will compare the Soroswap pair contract with the UniswapV2 pair contract, using the latter as a reference point. This will allow us to discuss why certain features are implemented or not implemented in the Soroswap pair contract.



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
a.-  Since Mint already exists as an event in the SAC token interface, an alternative name is necessary. For context, Ethereum's ERC20 emits a Transfer event when a token is minted. Refer to <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol> for details. Mint may not be the most descriptive name for this event, as the arguments are amount0 and amount1. A more fitting name is deposit, which represents the user's deposit of amount0 units of token0 and amount1 units of token1. Further, tracking the minted tokens is unnecessary, as the Mint event (LP units of LP tokens) is already being emitted. As a result, we've chosen to use deposit for this event.

b.- . Similarly, Burn has been replaced with withdraw. In Soroban, msg.sender is not utilized, so the event implementation becomes:

```rust
events::withdraw(&e, to, out_a, out_b, to)
```
<!---
why? To easily implement / transform Uniswap SDK's

review this
see in the code how is implemented, appears to be
different

-->


c.- The Swap event is implemented in Rust in a manner essentially equivalent to UniswapV2: 
```rust
pub(crate) fn swap(
    e: &Env,
    sender: Address,
    amount_0_in: i128,
    amount_1_in: i128,
    amount_0_out: i128,
    amount_1_out: i128,
    to: Address,
) {
    let topics = (PAIR, Symbol::new(e, "swap"), sender);
    e.events().publish(topics, (amount_0_in, amount_1_in, amount_0_out,amount_1_out,  to));
}
```

d.- sync is used in Rust to update the reserves after each change.

```rust
pub(crate) fn sync(e: &Env, reserve_0: u64, reserve_1: u64) {
    let topics = (PAIR, Symbol::new(e, "sync"));
    e.events().publish(topics, (reserve_0, reserve_1));
}
```

**These features are all implemented in the code!**

___
___


## SafeMath: Included!
In Solidity, the SafeMath library is used to validate arithmetic operations and prevent integer overflow/underflow. Should such a situation arise, the library throws an exception, which effectively reverts the transaction.

In Rust, we can achieve similar functionality by activating the overflow check flag with the following code during the compilation process:

In Rust, we can achieve a similar level of protection by enabling the [overflow check](https://doc.rust-lang.org/rustc/codegen-options/index.html#overflow-checks) flag during the compilation process with the following code:
```
[profile.release]
overflow-checks = true
```

Additionally, we use an overflow-safe implementation of functions `checked_add`, `checked_mul`, `checked_div`, and `checked_sub`. You can explore these functions and test their functionality in this repository: (https://github.com/esteblock/overflow-soroban/)

Also we have overflow-safe functions `checked_add`, `checked_mul`, `checked_div` and `checked_sub`

You can check and test these tecniques in the following repo: https://github.com/esteblock/overflow-soroban/

In conclusion, Soroswap prevents overflows by leveraging these techniques.
___

It is worth noting that since we are using i128, a signed integer type, underflows will not occur as they would simply result in negative numbers. However, to ensure the integrity of our calculations, we've implemented checks where necessary. For instance:
```rust
fn put_reserve_a(e: &Env, amount: i128) {
    if amount < 0 {
        panic!("put_reserve_a: amount cannot be negative")
    }
    e.storage().set(&DataKey::Reserve0, &amount)
}
```
**Overflow and Underflow safety is included in the code!**

___
___


## Reserves Function: included!
In UniswapV2, the reserves function returns the reserves of token0 and token1, along with the timestamp of the last block.
```javascript
 function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
     _reserve0 = reserve0;
     _reserve1 = reserve1;
     _blockTimestampLast = blockTimestampLast;
 }
 ```

Soroswap adopts a similar approach, implementing this functionality in the get_reserves function.

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
Additionally, the `get_block_timestamp_last` function in Soroswap returns the timestamp of the last block, defaulting to 0 if it doesn't exist.

 ```rust
fn get_block_timestamp_last(e: &Env) -> u64 {
 
    if let Some(block_timestamp_last) = e.storage().get(&DataKey::BlockTimestampLast) {
        block_timestamp_last.unwrap()
    } else {
        0
    }
}
 ```
 **This functionality is integrated directly into the Soroswap codebase!**

___
___

 ## Name of Pairs: included!

In UniswapV2, the name and symbol of the token pairs are designated as follows:

``` javascript
string public constant name = 'Uniswap V2';
string public constant symbol = 'UNI-V2';
```

Soroswap has similarly implemented the assignment of names and symbols for token pairs:

``` rust
Bytes::from_slice(&e, b"Soroswap Pair Token"),
Bytes::from_slice(&e, b"SOROSWAP-LP"),
```

**This feature has been seamlessly integrated into the Soroswap codebase!**
___
___


## Mint (Deposit)

In Uniswapv2: The mint function is called when a user adds liquidity to the pool. This function creates pool tokens. 

In Uniswap v2, the seller sends the asset to the core contract before calling the swap
function. Then, the contract measures how much of the asset it has received, by comparing
the last recorded balance to its current balance.
This means the core contract is agnostic to the way in which the trader transfers the asset. Instead of transferFrom, it could be a
meta transaction, or any other future mechanism for authorizing the transfer of ERC-20s.

```javascript

 // this low-level function should be called from a contract which performs important safety checks
 function mint(address to) external lock returns (uint liquidity) {
    (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
    uint balance0 = IERC20(token0).balanceOf(address(this));
    uint balance1 = IERC20(token1).balanceOf(address(this));
    uint amount0 = balance0.sub(_reserve0);
    uint amount1 = balance1.sub(_reserve1);

    bool feeOn = _mintFee(_reserve0, _reserve1);
    uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
    if (_totalSupply == 0) {
        liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
       _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
    } else {
        liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
    }
    require(liquidity > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_MINTED');
    _mint(to, liquidity);

    _update(balance0, balance1, _reserve0, _reserve1);
    if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
    emit Mint(msg.sender, amount0, amount1);
}

```
**Comments for Soroswap:**

In Soroswap this function is called `deposit`. In order not to make confusions with the `mint` function of the token token interface we will continue using `deposit` as the function name. 


 - This function (in Uniswapv2) uses reentrancy guard. Currently in Soroban it is not possible to do reentrancy (for now)... So for now, reentrancy guard it is not implemented.

- On UniswapV2 this function asumes that the tokens where already sent by the user... which in fact it is done by the Router contract... and it is with the Router contract that the user needs to approve its tokens to be spent. In UniswapV2, the router contract sends (with approval) tokens from the user to the Pair contract before executing the `mint` function... This design it's not necesary in Soroban (read <https://stellar.org/developers-blog/sorobans-technical-design-decisions-learnings-from-ethereum>) because the tokens can be sent with `from.require_auth();;`... which it is checked in the token contract itself...... 


The problem here is... what happens if there is a token that does not implements `require_auth`??..
In that case we need can follow the Uniswap design and implement a `Router` with a `addLiquidity_with_transfer_from` and a normal `addLiquidity` with `require_auth` ... in order to bypass those cases where tokens did not implement `require_auth`.

As for now, the objective is just to implement UniswapV2 Pair and Factory contracts, we will leave as it is now :
```rust
 fn deposit(e: Env, to: Address, desired_a: i128, min_a: i128, desired_b: i128, min_b: i128) {
        to.require_auth();
        ...
        let amounts = get_deposit_amounts(desired_a, min_a, desired_b, min_b, reserve_0, reserve_1);
        ...
        token_a_client.transfer(&to, &e.current_contract_address(), &amounts.0);
        token_b_client.transfer(&to, &e.current_contract_address(), &amounts.1);
```

In the next iteration, when Periphery contracts will be implemented (see <https://github.com/Uniswap/v2-periphery>) this function will change and will require the tokens to be sent before executing the  `deposit` function.

- Implement `bool feeOn = _mintFee(_reserve0, _reserve1);` DONE
- `uint _totalSupply = totalSupply;` in Soroban token interface there is no such `totalSupply`, hence we implement a `get_total_shares` and a `put_total_shares` function.
- 
- UniswapV2Pair copares whether ther totalSupply==0 in order to send the "first" LP with sqrt(x*y), this is because UniswapV2Pair mints a MINIMUM_LIQUIDITY to the zero address in order to permanently lock it forever. The purpose of locking the MinLiq tokens is to establish a lower bound for the liquidity in the pool. This ensures that there is always some level of liquidity available, preventing scenarios where liquidity providers could fully drain a pool and leave it with no liquidity.
- 
Uniswap takes the minimum liquidity as 1e-15 pool shares that are 1000 times the minimum quantity of pool shares (in Ethereum, UniswapV2LP tokens have 18 decimals, hence 1 token unit represent 1e-18)...
In the stellar/soroban-examples version of the liquidity_pool contract, this minimum liquidity is not implemented. 

To do something similar in Soroswap, we also mint 1000 times the minimum quantity of tokens, by also minting 10**3 as minimum liquidity. As Stellar classic asset have 7 decimals, Soroswap will also have 7 decimals (at least for this first version). This means that this minimum liquidity whould represent 1e-4 pool shares.

```
uint public constant MINIMUM_LIQUIDITY = 10**3;
```
___
___

## Swap
```javascript

    // this low-level function should be called from a contract which performs important safety checks
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, 'UniswapV2: INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, 'UniswapV2: INSUFFICIENT_LIQUIDITY');

        uint balance0;
        uint balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, 'UniswapV2: INVALID_TO');
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
        if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, 'UniswapV2: INSUFFICIENT_INPUT_AMOUNT');
        { // scope for reserve{0,1}Adjusted, avoids stack too deep errors
        uint balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
        uint balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
        require(balance0Adjusted.mul(balance1Adjusted) >= uint(_reserve0).mul(_reserve1).mul(1000**2), 'UniswapV2: K');
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

```


___
___
## Burn (Withdraw)
```javascript

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to) external lock returns (uint amount0, uint amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        address _token0 = token0;                                // gas savings
        address _token1 = token1;                                // gas savings
        uint balance0 = IERC20(_token0).balanceOf(address(this));
        uint balance1 = IERC20(_token1).balanceOf(address(this));
        uint liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
        require(amount0 > 0 && amount1 > 0, 'UniswapV2: INSUFFICIENT_LIQUIDITY_BURNED');
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount0, amount1, to);
    }

```

___
___