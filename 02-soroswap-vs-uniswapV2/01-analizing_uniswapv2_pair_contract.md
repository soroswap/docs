# Comparison of Soroswap and UniswapV2 Pair Contracts: Part 1


The sources for the following two sections are:

- <https://blog.uniswap.org/uniswap-v2>  
- <https://rskswap.com/audit.html>

  The Pair contract for Soroswap, written in Rust, is inspired by the UniswapV2Pair contract, which is written in 
Solidity. However, in its first version (0.0.1), the SoroswapPairV0.0.1 does not currently implement many functions, 
variables, events, and other features that are present in the UniswapV2Pair contract.

In the next two sections, we will compare the Soroswap pair contract with the UniswapV2 pair contract, using the latter 
as a reference point. This allows us to discuss why certain features are implemented or not implemented in the Soroswap pair contract.



## Events: Included!
The UniswapV2 pair contract has four events: Mint, Burn, Swap and Sync.
The corresponding events in the Soroswap pair contract are: deposit, withdraw, swap, and sync.

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
Since Mint already exists as an event in the SAC token interface, an alternative name is necessary. For context, 
Ethereum\'s ERC20 protocol emits a Transfer event when a token is minted. Refer to <https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol> for details. 

Mint may not be the most descriptive name for this 
event, as the arguments are amount0 and amount1. A more fitting name is deposit, which represents the user's deposit of amount0 units of token0 and amount1 units of token1. Further, tracking the minted tokens is unnecessary, as the Mint 
event (LP units of LP tokens) is already being emitted. As a result, we've chosen to use deposit for this event.

Similarly, Burn has been replaced with withdraw. In Soroban, msg.sender is not utilized, so the event 
implementation becomes:

```rust
events::withdraw(&e, to, out_a, out_b, to)
```
<!---
why? To easily implement / transform Uniswap SDK's

review this
see in the code how is implemented, appears to be
different

-->


The Swap event is implemented in Rust in a manner essentially equivalent to UniswapV2: 
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

The sync event is used in Rust to update the reserves after each change.

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
<!---
Make this consistent with the oracles and arithmetic section
--->
In Solidity, the SafeMath library is used to validate arithmetic operations and prevent integer overflow and underflow. 
When such a situation arise, the library throws an exception, which effectively reverts the transaction.

In Rust, we can achieve a similar level of protection by enabling the [overflow check](https://doc.rust-lang.org/rustc/codegen-optionsindex.html#overflow-checks) flag during the compilation process with the following code:
```
[profile.release]
overflow-checks = true
```

Additionally, we have an overflow-safe implementation of functions `checked_add`, `checked_mul`, `checked_div`, and `
checked_sub`. You can explore these functions and test their functionality in this repository: (https://github.com/esteblock/overflow-soroban/)

In conclusion, Soroswap prevents overflows by leveraging these techniques.
___

It is worth noting that since we are using i128, a signed integer type, underflow will not occur as they would simply 
result in negative numbers. However, to ensure the integrity of our calculations, we've implemented checks where 
necessary. For instance:
```rust
fn put_reserve_a(e: &Env, amount: i128) {
    if amount < 0 {
        panic!("put_reserve_a: amount cannot be negative")
    }
    e.storage().set(&DataKey::Reserve0, &amount)
}
```
**Overflow and underflow safety are included in the code!**

___
___


## Reserves Function: included!
In UniswapV2, the reserves function returns the reserves of token0 and token1, along with the timestamp of the last 
block.
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
Additionally, the `get_block_timestamp_last` function in Soroswap returns the timestamp of the last block, defaulting 
to 0 if it doesn't exist.

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

In UniswapV2, the mint function is invoked when a user adds liquidity to the pool, resulting in the creation of pool 
tokens. Before calling the swap function, the seller transfers the asset to the core contract. The contract then 
measures the received asset quantity by comparing the last recorded balance with its current balance. This approach 
makes the core contract agnostic to how the trader transfers the asset. Instead of transferFrom, a meta transaction or 
any other future mechanism for authorizing the transfer of ERC-20s can be used.


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
### Comments for Soroswap implementation:

- The equivalent function in Soroswap is named deposit. To avoid confusion with the mint function of the token 
interface, we have opted to keep deposit as the function name.

 - This function in UniswapV2 employs a reentrancy guard. Since reentrancy is not currently possible in Soroban, we 
have not implemented this guard.

- In UniswapV2, the router contract sends (with approval) tokens from the user to the Pair contract before executing 
the mint function.
   This design isn't necessary in Soroban (read <https://stellar.org/developers-blog/sorobans-technical-design-decisions-learnings-from-ethereum>) 
   because tokens can be sent using from.require_auth();, which is checked in the token contract itself. 

- However, we need to consider tokens that do not implement require_auth. In such cases, we can follow Uniswap's design 
and implement a `Router` with a `addLiquidity_with_transfer_from` and a standard `addLiquidity` with `require_auth`.

- For now, our objective is simply to implement the UniswapV2 Pair and Factory contracts, so we'll maintain the current
 design:

```rust
 fn deposit(e: Env, to: Address, desired_a: i128, min_a: i128, desired_b: i128, min_b: i128) {
        to.require_auth();
        ...
        let amounts = get_deposit_amounts(desired_a, min_a, desired_b, min_b, reserve_0, reserve_1);
        ...
        token_a_client.transfer(&to, &e.current_contract_address(), &amounts.0);
        token_b_client.transfer(&to, &e.current_contract_address(), &amounts.1);
```

In the next iteration, when Periphery contracts will be implemented (see <https://github.com/Uniswap/v2-periphery>) 
this function will change and will require the tokens to be sent before executing the  `deposit` function.

-  We've implemented bool feeOn = _mintFee(_reserve0, _reserve1);.
-  As there's no `totalSupply` in the Soroban token interface, we've implemented a `get_total_shares` and a `
put_total_shares` function.
- UniswapV2Pair compares whether `totalSupply == 0` to send the “first” LP with `sqrt(x*y)` because it mints a `
MINIMUM_LIQUIDITY` to the zero address to permanently lock it forever. This ensures there's always some level of 
liquidity available, preventing scenarios where liquidity providers could fully drain a pool.

  
Uniswap defines the least amount of liquidity as 1e-15 of the total pool shares, which equates to 1000 times the 
smallest possible unit of pool shares. To illustrate, UniswapV2 LP tokens operate with 18 decimal places, meaning one 
token unit corresponds to 1e-18.

However, in the Stellar-based soroban-examples liquidity pool contract, such a minimum liquidity requirement is absent.

Soroswap emulates this approach by creating 1000 times the smallest possible unit of tokens, equating to $10^3$ as the 
minimum liquidity. In line with the traditional Stellar assets, which have 7 decimals, Soroswap also uses 7 decimals 
places for this initial version. As such, this minimum liquidity represents 1e-4 of the total pool shares.
___
___


<!---
TODO:
review swap and burn
--->

## Swap

This function is invoked when a user swaps tokens. Emits Swap and Sync events.

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

The equivalent function in Soroswap is as follows:
```rust
   fn swap(e: Env, to: Address, buy_0: bool, amount_out: i128, amount_in_max: i128) {
        to.require_auth();

        /*
        UniswapV2 implements 2 things that Soroswap it's not going to implement for now:
        1.- FlashSwaps. Soroban is not allowing reentrancy for the momennt. So no data as a parameter.
        2.- uint amount0Out as parameter. Soroswap will impleent all the logig in the Router contract.

        All this logic will change in this contract when the Router contract is implemented
        */
        
        if amount_out <= 0 { panic!("insufficient output amount") }
        if to == get_token_0(&e) || to == get_token_1(&e) {panic!("invalid to")}
        
        
        let (reserve_0, reserve_1) = (get_reserve_0(&e), get_reserve_1(&e));
        let (reserve_in, reserve_out) = if buy_0 {
            (reserve_1, reserve_0)
        } else {
            (reserve_0, reserve_1)
        };
        
        // First calculate how much needs to be sold to buy amount amount_out from the pool
        let n = reserve_in.checked_mul(amount_out).unwrap().checked_mul(1000).unwrap();
        let d = (reserve_out.checked_sub(amount_out).unwrap()).checked_mul(997).unwrap();
        let amount_in = (n.checked_div(d).unwrap()).checked_add(1).unwrap();

        if amount_in > amount_in_max {panic!("amount in is over max") }
        if amount_in <= 0 { panic!("insufficient input amount")}
        
        // Transfer the amount_in being sold to the contract
        let sell_token = if buy_0 { get_token_1(&e) } else { get_token_0(&e) };
        let sell_token_client = TokenClient::new(&e, &sell_token);
        sell_token_client.transfer(&to, &e.current_contract_address(), &amount_in);

        let (balance_0, balance_1) = (get_balance_0(&e), get_balance_1(&e));

        // residue_numerator and residue_denominator are the amount that the invariant considers after
        // deducting the fee, scaled up by 1000 to avoid fractions
        let residue_numerator: i128 = 997;
        let residue_denominator: i128 = 1000;
        let zero = 0;

        let new_invariant_factor = |balance: i128, reserve: i128, amount_out: i128| {
            let delta = balance.checked_sub(reserve).unwrap().checked_sub(amount_out).unwrap();
            let adj_delta = if delta > zero {
                //residue_numerator * delta
                residue_numerator.checked_mul(delta).unwrap()
            } else {
              //  residue_denominator * delta
                residue_denominator.checked_mul(delta).unwrap()
            };
            //residue_denominator * reserve + adj_delta
            residue_denominator.checked_mul(reserve).unwrap().checked_add(adj_delta).unwrap()
        };

        let (amount_0_in, amount_1_in) = if buy_0 { (0, amount_in) } else { (amount_in, 0) };
        let (amount_0_out, amount_1_out) = if buy_0 { (amount_out, 0) } else { (0, amount_out) };

        let new_inv_a = new_invariant_factor(balance_0, reserve_0, amount_0_out);
        let new_inv_b = new_invariant_factor(balance_1, reserve_1, amount_1_out);
        //let old_inv_a = residue_denominator * reserve_0;
        let old_inv_a = residue_denominator.checked_mul(reserve_0).unwrap();
        //let old_inv_b = residue_denominator * reserve_1;
        let old_inv_b = residue_denominator.checked_mul(reserve_1).unwrap();

        // if new_inv_a * new_inv_b < old_inv_a  * old_inv_b {
        if new_inv_a.checked_mul(new_inv_b).unwrap() < old_inv_a.checked_mul(old_inv_b).unwrap() {
            panic!("constant product invariant does not hold");
        }

        if buy_0 {
            transfer_token_0_from_pair(&e, to.clone(), amount_0_out);
        } else {
            transfer_token_1_from_pair(&e, to.clone(), amount_1_out);
        }

        let new_balance_0 = balance_0.checked_sub(amount_0_out).unwrap();
        let new_balance_1 = balance_1.checked_sub(amount_1_out).unwrap();
        update(&e, new_balance_0, new_balance_1, reserve_0.try_into().unwrap(), reserve_1.try_into().unwrap());
        event::swap(&e, to.clone(), amount_0_in, amount_1_in, amount_0_out, amount_1_out, to);
    } fn swap
```
    

___
___
## Burn (Withdraw)

This function is invoked when a user withdraws liquidity from the pool. Emits Burn, Transfer and Sync events.

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

The equivalent function in Soroswap is as follows:

```rust
fn withdraw(e: Env, to: Address, share_amount: i128, min_a: i128, min_b: i128) -> (i128, i128) {
        to.require_auth();
        // We get the original reserves before the action:
        let (mut reserve_0, mut reserve_1) = (get_reserve_0(&e), get_reserve_1(&e));
        
        /*
        For now we are sending the pair token to the contract here.
        This will change with a Router contract that will send the tokens to us.
        */
        Token::transfer(e.clone(), to.clone(), e.current_contract_address(), share_amount);
        // address _token0 = token0;                                // gas savings
        // address _token1 = token1;                                // gas savings
        // uint balance0 = IERC20(_token0).balanceOf(address(this));
        // uint balance1 = IERC20(_token1).balanceOf(address(this));
        // uint liquidity = balanceOf[address(this)];
        let (mut balance_0, mut balance_1) = (get_balance_0(&e), get_balance_1(&e));
        let user_sent_shares = get_balance_shares(&e).checked_sub(MINIMUM_LIQUIDITY).unwrap();
        
        // bool feeOn = _mintFee(_reserve0, _reserve1);
        let fee_on: bool = mint_fee(&e, reserve_0, reserve_1);

        // uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        let total_shares = get_total_shares(&e);

        // Now calculate the withdraw amounts
        let out_0 = (balance_0.checked_mul(user_sent_shares).unwrap()).checked_div(total_shares).unwrap();
        let out_1 = (balance_1.checked_mul(user_sent_shares).unwrap()).checked_div(total_shares).unwrap();

        if out_0 <= 0 || out_1 <= 0 {
            panic!("insufficient amount_0 or amount_1");
        }

        // TODO: In the next iteration this should be in the Router contract
        if out_0 < min_a || out_1 < min_b {
            panic!("min not satisfied");
        }

        // _burn(address(this), liquidity);
        burn_shares(&e, user_sent_shares);
        transfer_token_0_from_pair(&e, to.clone(), out_0.clone());
        transfer_token_1_from_pair(&e, to.clone(), out_1.clone());
        (balance_0, balance_1) = (get_balance_0(&e), get_balance_1(&e));

        // _update(balance0, balance1, _reserve0, _reserve1);
        update(&e, balance_0, balance_1, reserve_0.try_into().unwrap(), reserve_1.try_into().unwrap());
        // Update reserve_0 and reserve_1 after being updated in update() function:
        (reserve_0, reserve_1) = (get_reserve_0(&e), get_reserve_1(&e)); 
        // if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        if fee_on {
            put_klast(&e, reserve_0.checked_mul(reserve_1).unwrap());
        }

        event::withdraw(&e, to.clone(), user_sent_shares, out_0, out_1, to);
      
        (out_0, out_1)
    }

