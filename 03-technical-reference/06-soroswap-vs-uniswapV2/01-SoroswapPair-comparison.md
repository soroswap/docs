# SoroswapPair Comparison

The sources for the following two sections are:

* [https://blog.uniswap.org/uniswap-v2](https://blog.uniswap.org/uniswap-v2) &#x20;
* [https://rskswap.com/audit.html](https://rskswap.com/audit.html)

&#x20; The Pair contract for Soroswap, written in Rust, is inspired by the UniswapV2Pair contract, which is written in Solidity. However, in its first version (0.0.1), the SoroswapPairV0.0.1 does not currently implement many functions, variables, events, and other features that are present in the UniswapV2Pair contract.

In the next two sections, we will compare the Soroswap pair contract with the UniswapV2 pair contract, using the latter as a reference point. This allows us to discuss why certain features are implemented or not implemented in the Soroswap pair contract.

## Events: Included!

The UniswapV2 pair contract has four events: Mint, Burn, Swap and Sync. The corresponding events in the Soroswap pair contract are: deposit, withdraw, swap, and sync.

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

Since Mint already exists as an event in the SAC token interface, an alternative name is necessary. For context, Ethereum's ERC20 protocol emits a Transfer event when a token is minted. Refer to [https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) for details.

Mint may not be the most descriptive name for this event, as the arguments are amount0 and amount1. A more fitting name is deposit, which represents the user's deposit of amount0 units of token0 and amount1 units of token1. Further, tracking the minted tokens is unnecessary, as the Mint event (LP units of LP tokens) is already being emitted. As a result, we've chosen to use deposit for this event.

Similarly, Burn has been replaced with withdraw. In Soroban, msg.sender is not utilized, so the event implementation becomes:

```rust
events::withdraw(&e, to, out_a, out_b, to)
```

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

***

***

## SafeMath: Included!

In Solidity, the SafeMath library is used to validate arithmetic operations and prevent integer overflow and underflow. When such a situation arise, the library throws an exception, which effectively reverts the transaction.

In Rust, we can achieve a similar level of protection by enabling the [overflow check](https://doc.rust-lang.org/rustc/codegen-optionsindex.html#overflow-checks) flag during the compilation process with the following code:

```
[profile.release]
overflow-checks = true
```

In addition, we have an overflow-safe implementation of functions `checked_add`, `checked_mul`, `checked_div`, and `checked_sub`. You can explore these functions and test their functionality in this repository: [https://github.com/esteblock/overflow-soroban/](https://github.com/esteblock/overflow-soroban/)

When it comes to preventing overflow in Soroban, we have the two solutions mentioned above: using the compiler flag or the overflow-safe functions. Yet, as we will see in the oracle section, there are cases where overflow is the intended result. Hence, we will bypass the compiler flag option, choosing instead to use overflow-safe functions for our arithmetic operations. Exceptions will be made only in those unique cases where overflow is desirable.

***

About underflow, it is worth noting that since we are using i128, a signed integer type, underflow will not occur as it would simply result in negative numbers. However, to ensure the integrity of our calculations, we've implemented checks where necessary. For instance:

```rust
fn put_reserve_a(e: &Env, amount: i128) {
    if amount < 0 {
        panic!("put_reserve_a: amount cannot be negative")
    }
    e.storage().set(&DataKey::Reserve0, &amount)
}
```

**Overflow and underflow safety are included in the code!**

***

***

## Reserves Function: included!

In UniswapV2, the reserves function returns the reserves of token0 and token1, along with the timestamp of the last block.

```javascript
 function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
     _reserve0 = reserve0;
     _reserve1 = reserve1;
     _blockTimestampLast = blockTimestampLast;
 }
```

Soroswap adopts a similar approach, implementing this functionality in the get\_reserves function.

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

***

***

## Name of Pairs: included!

In UniswapV2, the name and symbol of the token pairs are designated as follows:

```javascript
string public constant name = 'Uniswap V2';
string public constant symbol = 'UNI-V2';
```

Soroswap has similarly implemented the assignment of names and symbols for token pairs:

```rust
Bytes::from_slice(&e, b"Soroswap Pair Token"),
Bytes::from_slice(&e, b"SOROSWAP-LP"),
```

**This feature has been seamlessly integrated into the Soroswap codebase!**

***

***

## Mint (Deposit)

In UniswapV2, the mint function is invoked when a user adds liquidity to the pool, resulting in the creation of pool tokens. Before calling the swap function, the seller transfers the asset to the core contract. The contract then measures the received asset quantity by comparing the last recorded balance with its current balance. This approach makes the core contract agnostic to how the trader transfers the asset. Instead of transferFrom, a meta transaction or any other future mechanism for authorizing the transfer of ERC-20s can be used.

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

* The equivalent function in Soroswap is named deposit. To avoid confusion with the mint function of the token interface, we have opted to keep deposit as the function name.
* This function in UniswapV2 employs a reentrancy guard. Since reentrancy is not currently possible in Soroban, we have not implemented this guard.
* In UniswapV2, the router contract sends (with approval) tokens from the user to the Pair contract before executing the mint function. This design isn't necessary in Soroban (read [https://stellar.org/developers-blog/sorobans-technical-design-decisions-learnings-from-ethereum](https://stellar.org/developers-blog/sorobans-technical-design-decisions-learnings-from-ethereum)) because tokens can be sent using from.require\_auth();, which is checked in the token contract itself.
* However, we need to consider tokens that do not implement require\_auth. In such cases, we can follow Uniswap's design and implement a `Router` with a `addLiquidity_with_transfer_from` and a standard `addLiquidity` with `require_auth`.
* For now, our objective is simply to implement the UniswapV2 Pair and Factory contracts, so we'll maintain the current design:

```rust
 fn deposit(e: Env, to: Address, desired_a: i128, min_a: i128, desired_b: i128, min_b: i128) {
        to.require_auth();
        ...
        let amounts = get_deposit_amounts(desired_a, min_a, desired_b, min_b, reserve_0, reserve_1);
        ...
        token_a_client.transfer(&to, &e.current_contract_address(), &amounts.0);
        token_b_client.transfer(&to, &e.current_contract_address(), &amounts.1);
```

In the next iteration, when Periphery contracts will be implemented (see [https://github.com/Uniswap/v2-periphery](https://github.com/Uniswap/v2-periphery)) this function will change and will require the tokens to be sent before executing the  `deposit` function.

* &#x20;We've implemented bool feeOn = \_mintFee(\_reserve0, \_reserve1);.
* &#x20;As there's no `totalSupply` in the Soroban token interface, we've implemented a `get_total_shares` and a `put_total_shares` function.
* UniswapV2Pair compares whether `totalSupply == 0` to send the “first” LP with `sqrt(x*y)` because it mints a `MINIMUM_LIQUIDITY` to the zero address to permanently lock it forever. This ensures there's always some level of liquidity available, preventing scenarios where liquidity providers could fully drain a pool.

Uniswap defines the least amount of liquidity as 1e-15 of the total pool shares, which equates to 1000 times the smallest possible unit of pool shares. To illustrate, UniswapV2 LP tokens operate with 18 decimal places, meaning one token unit corresponds to 1e-18.

However, in the Stellar-based soroban-examples liquidity pool contract, such a minimum liquidity requirement is absent.

Soroswap emulates this approach by creating 1000 times the smallest possible unit of tokens, equating to 10\*\*3 as the minimum liquidity. In line with the traditional Stellar assets, which have 7 decimals, Soroswap also uses 7 decimals places for this initial version. As such, this minimum liquidity represents 1e-4 of the total pool shares.

***

***

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
        1.- FlashSwaps. Soroban is not allowing reentrancy for the moment. So no data as a parameter.
        2.- uint amount0Out as parameter. Soroswap will impleent all the login in the Router contract.

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

***

***

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

````rust
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



## Reentrancy Guards: Currently not implemented

In UniswapV2, a reentrancy guard is employed to prevent recursive calls. Here is the corresponding code snippet:

```javascript
    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'UniswapV2: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }
````

For now, Soroban does not permit reentrancy. Further information is available at these sources:

* [https://github.com/esteblock/reentrancy-soroban](https://github.com/esteblock/reentrancy-soroban)
* [https://discord.com/channels/897514728459468821/993874836336152576](https://discord.com/channels/897514728459468821/993874836336152576)

We plan to revisit this aspect if the allowance of reentrancy is considered in the future.

**Current Status: Not implemented**

***

***

## Protocol Fee Mechanism: Mint Fee Implemented!

UniswapV2 incorporates a protocol fee of 0.05%, which can be toggled on or off. When activated, this fee is routed to an address, `feeTo`, specified in the factory contract. Initially, `feeTo` isn't set, and hence, no fees are collected. There is a designated address, `feeToSetter`, with the power to invoke the `setFeeTo` function on the UniswapV2 factory contract, altering the `feeTo` value. `feeToSetter` can also change its address via the `setFeeToSetter` function.

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

The Soroswap equivalent to the above code is:

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

In this code, we have utilized the `checked_add`, `checked_sub`, `checked_mult` and `checked_div` functions to prevent potential overflows.

**This functionality has been successfully integrated into the code!**

***

***

## Oracles:

The marginal price of a token pair is calculated by dividing the reserve of one token by the reserve of the other token. Since arbitrageurs will trade against the pair contract to make profits, the marginal price of the pair contract will tend to follow the market price, so maybe we can use the marginal price as an oracle for the market price.

However, this is not enough to reliably use this price as an on-chain oracle. An attacker could manipulate the price at an specific moment. If the attacker can get a dApp to check the oracle at the precise instant when the price has been manipulated, then they can cause significant harm to the system. UniswapV1 was vulnerable to this attack, as we can see [here](https://samczsun.com/taking-undercollateralized-loans-for-fun-and-for-profit/). In UniswapV2, the oracle function was modified to prevent this attack, and we will use this oracle function as a reference for our implementation.

The solution is to use a cumulative price, which is the sum of the marginal prices over a period of time. The oracle measures and stores the price before the first trade of each block. This price is more difficult to manipulate than the prices in the middle of a block. If the attacker tries to manipulate the price at the start of the block, another arbitrageur can send a transaction to trade back the manipulated price to the real price, so the attacker can't profit from the manipulation. A miner or an attacker that uses enough gas to fill an entire block can try to manipulate the price at the end of the block, but this will be useless if they mine the following block themselves. The miners can't know if they will mine the next block, so they can't profit from this manipulation.

So, we know that the price at the start of the block is difficult to manipulate, but we still need to know how to use it as an oracle.

### A note on arithmetic operations and data types:

The design of oracle functions requires some consideration of arithmetic operations and data types, given that neither Solidity nor Soroban support floating-point numbers or non-integer number data types natively. Both systems employ custom-made fixed-point number data types, conforming to the [Q format](https://en.wikipedia.org/wiki/Q\_\(number\_format\)), which are stored as integers.

The Q format is a [fixed-point number](https://en.wikipedia.org/wiki/Fixed-point\_arithmetic) format that specifies the number of bits used for the integer and fractional parts. Both UniswapV2 and Soroswap utilize the **unsigned** variant of the Q format, called UQ, only diverging in the number of bits assigned for the integer and fractional components. A UQn.m number is stored as an unsigned integer of n+m bits, where the first n bits are used for the integer part, and the last m bits are used for the fractional part.

For illustration, suppose that we have a UQ4.4 format. It means that we are using 4 bits for the integer part and 4 bits for the fractional part. The whole number is stored as an 8-bit unsigned integer. Some examples of UQ4.4 numbers are:

* The number 1.5 in UQ4.4 format is represented as 00011000 in binary. The first four bits (0001) represent the integer part 1, and the last four bits (1000) represent the fractional part 0.5.
* The number 3.75 in UQ4.4 format is represented as 00111100 in binary. The first four bits (0011) represent the integer    part 3, and the last four bits (1100) represent the fractional part 0.75.

To convert the binary number back to a decimal number, we divide the value represented by the fractional part by 2 to the power of m. In the case of UQ4.4 format, we divide by $2^4$ = 16. So, 00011000 would be converted to 1 (from the integer part) plus 8/16 (from the fractional part), or 1.5.

In the case of UniswapV2, the [UQ112.112](https://github.com/Uniswap/v2-core/blob/master/contracts/libraries/UQ112x112.sol) is used, in contrast to the UQ64.64 used in Soroswap whose implementation is on [https://github.com/esteblock/fractions-soroban](https://github.com/esteblock/fractions-soroban)

```javascript
using UQ112x112 for uint224;
...
uint112 private reserve0;           // uses single storage slot, accessible via getReserves
uint112 private reserve1;           // uses single storage slot, accessible via getReserves
uint public price0CumulativeLast;
uint public price1CumulativeLast;
uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves
...
// update reserves and, on the first call per block, price accumulators
function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
    require(balance0 <= uint112(-1) && balance1 <= uint112(-1), 'UniswapV2: OVERFLOW');
    uint32 blockTimestamp = uint32(block.timestamp % 2**32);
    uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
    if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
        // * never overflows, and + overflow is desired
        price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
        price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
    }
    reserve0 = uint112(balance0);
    reserve1 = uint112(balance1);
    blockTimestampLast = blockTimestamp;
    emit Sync(reserve0, reserve1);
}

```

Here, many things are happening:

* Balances need to fit within the uint112 data type to be encoded into UQ112x112 and undergo division operations.
  * **For Soroswap:** Balances will need to fit within an u64 type to be encoded into UQ64X64.
* Block timestamps are obtained by using the modulo operator to fit them within the uint32 data type. This is done for gas optimization purposes, as described in the whitepaper. Consequently, each set of 224-bit reserves (two reserves as 112-bit) is accompanied by a 32-bit timestamp within a single 256-bit storage slot.
  * **For Soroswap:** We won't pay much attention for now in gas usage. Can be u32 or u64
* The block timestamp has the potential to overflow, with the next overflow occurring on 02/07/2106. Oracles are required to account for this and ensure proper functionality by checking prices at least once within each interval of 2^ 32 - 1 seconds (approximately 136 years).
  * **For Soroswap:** Block timestamp can be stored in u64, and will overflow in the year 2554, so we are safe.
* The variables price0CumulativeLast and price1CumulativeLast are stored using 224 bits each because they hold a sum and multiplications of UQ112X112.\

  * **For Soroswap:** price0CumulativeLast will need to be u128.
* The price itself will not overflow, but the accumulated price over an interval may exceed the 224-bit limit. To address this, an additional 32 bits are allocated in the storage slots for the accumulated prices of the ratios token A/token B and token B/token A. These extra bits handle any overflow resulting from repeated summations of prices.
  * **For Soroswap:** By default price0CumulativeLast won't be able to overflow in soroban due to the `overflow-checks = true`. Also, there are no bigger integer types in Soroban. See [https://soroban.stellar.org/docs/fundamentals-and-concepts/built-in-types](https://soroban.stellar.org/docs/fundamentals-and-concepts/built-in-types)

As per the official Uniswap audit [remarks](https://rskswap.com/audit.html#orgc9b3190), we permit overflow in the case of  accumulators. This is primarily a protective strategy; an overflow-induced revert might result in a liveness failure. This  means that a revert in the \_update could impede trade operations as well as hinder the entry and exit of liquidity providers (LPs).

The necessity for price0CumulativeLast to overflow is emphasized to prevent the protocol from reaching a panic state. The audit illustrates this through a simulation:

> Assuming that the ratio of the reserves in a given pair will be the same as the ratio of the dollar prices of one wei of each token, we can solve for a example pair consisting of a 36 decimal token and a 2 decimal token where the unit value of the 2 decimal token is 100 times that of the 36 decimal token: giving ≈ 8 months until overflow!
>
> Authors of oracles that build upon the price accumulator functionality in the core should therefore take care that the their oracles do not introduce spikes or discontinuities in the reported price at the overflow point, if price accumulator overflow is a realistic possibility for the assets involved.

**What this means for Soroswap?**\
This means that Soroswap should allow overflow, hence not using overflow-checks = true, but using `checked_fn` every time the overflow it is NOT DESIRED (all parts except for price0CumulativeLast)

* The reserves are stored using 112 bits for each token.

**For Soroswap:** We will use u64

**Implemented!**

***

***

***

***

## Skim

From UniswapV2 Whitepaper:

> To protect against bespoke token implementations that can update the pair contract’s balance, and to more gracefully handle tokens whose total supply can be greater than $2^{112}$, Uniswap v2 has two bail-out functions: sync()and skim().
>
> sync() functions as a recovery mechanism in the case that a token asynchronously deflates the balance of a pair. In this case, trades will receive sub-optimal rates, and if no liquidity provider is willing to rectify the situation, the pair is stuck. sync() exists to set the reserves of the contract to the current balances, providing a somewhat graceful recovery from this situation.
>
> skim() functions as a recovery mechanism in case enough tokens are sent to an pair to overflow the two uint112 storage slots for reserves, which could otherwise cause trades to fail. skim() allows a user to withdraw the difference between the current balance of the pair and 2\*\*2112 − 1 to the caller, if that difference is greater than 0.

```javascript
function sync() external lock {
         _update(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)), reserve0, reserve1);
     }

// force balances to match reserves
    function skim(address to) external lock {
         address _token0 = token0; // gas savings
         address _token1 = token1; // gas savings
         _safeTransfer(_token0, to, IERC20(_token0).balanceOf(address(this)).sub(reserve0));
         _safeTransfer(_token1, to, IERC20(_token1).balanceOf(address(this)).sub(reserve1));
    }

```

Implementation in Soroban:

```rust
  // force balances to match reserves
    fn skim(e: Env, to: Address) {
        let (balance_0, balance_1) = (get_balance_0(&e), get_balance_1(&e));
        let (reserve_0, reserve_1) = (get_reserve_0(&e), get_reserve_1(&e));
        transfer_token_0_from_pair(&e, to.clone(), balance_0.checked_sub(reserve_0).unwrap());
        transfer_token_1_from_pair(&e, to, balance_1.checked_sub(reserve_1).unwrap());
    }
```

***

***

## Safe Transfer: not needed

The `_safeTransfer` function is specific to Solidity and isn't necessary to be implemented in Soroban.

```javascript
bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

function _safeTransfer(address token, address to, uint value) private {
    (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
    require(success && (data.length == 0 || abi.decode(data, (bool))), 'UniswapV2: TRANSFER_FAILED');
}
```

***

***

## Constructor: not needed

In Soroban, the `constructor()` and `initialize()` functions are the same, thus there's no need to separate them.

```javascript
    constructor() public {
        factory = msg.sender;
    }
    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'UniswapV2: FORBIDDEN'); // sufficient check
        token0 = _token0;
        token1 = _token1; 
    }
```
