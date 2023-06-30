# Sources:
https://blog.uniswap.org/uniswap-v2
https://rskswap.com/audit.html


# Analizing UniswapPair (UniswapV2)
The Pair contract written in rust for Soroswap has been inspired in the UniswapV2Pair contract written in Solidiy.

However, from the first (0.0.1) version, there are a lot of functions, variables, events and others, that are not currently implemented in SoroswapPairV0.0.1.

In the following we analize every function/ line that can or cannot be included in the Pair contract:

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


**Included in the code!**

___
___

## SafeMath: Included!
In Solidity: The SafeMath library validates if an arithmetic operation would result in an integer overflow/underflow. If it would, the library throws an exception, effectively reverting the transaction.

In Rust this should be OK with
```
[profile.release]
overflow-checks = true
```
Also we have `checked_add`, `checked_mul`, `checked_div` and `checked_sub`

You can check and test these tecniques in the following repo: https://github.com/esteblock/overflow-soroban/

Conclusion: Soroswap will implement all of the tecniques above

___
However, as we are using i128, underflow won't happen... we will have negative numbers.
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
Check here: https://github.com/esteblock/reentrancy-soroban
And here: https://discord.com/channels/897514728459468821/993874836336152576

We will need to come back to this later if reentrancy will be allowed

**status: Not implemented for the moment**

___
___

## Oracles:

Are we going to use UniswapV2 or UniswapV3 Oracle function?

- `using UQ112x112 for uint224;`
This is done for storing floating points.
In Soroban we can use a Custom Type https://soroban.stellar.org/docs/how-to-guides/custom-types

In Soroswap we have created the `UQ64X64`: https://github.com/esteblock/fractions-soroban


- Update Reserves:
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
Here a lot of things are happening:
- Balances need to fit within the uint112 data type in order to be encoded into UQ112x112 and undergo division operations.
**For Soroswap: ** Balances will need to git within a u64 type to be encoded into UQ64X64

- Block timestamps are obtained by using the modulo operator to fit them within the uint32 data type. This is done for gas optimization purposes, as described in the whitepaper. Consequently, each set of 224-bit reserves (two reserves os 112-bit) is accompanied by a 32-bit timestamp within a single 256-bit storage slot.
**For Soroswap:** We won't pay much attention for now in gas usage.  Can be u32 or u64


- The block timestamp has the potential to overflow, with the next overflow occurring on 02/07/2106. Oracles are required to account for this and ensure proper functionality by checking prices at least once within each interval of 2^32 - 1 seconds (approximately 136 years).
**For Soroswap: ** Block timestamp can be stored in u64, and will overflow in the year 2554, so we are safe.

- The variables price0CumulativeLast and price1CumulativeLast are stored using 224 bits each, because they hold a sum and multitplications of UQ112X112.
**For Soroswap:** price0CumulativeLast will need to be u128


- The price itself will not overflow, but the accumulated price over an interval may exceed the 224-bit limit. To address this, an additional 32 bits are allocated in the storage slots for the accumulated prices of token A/token B and token B/token A. These extra bits handle any overflow resulting from repeated summations of prices.
**For Soroswap:** By default price0CumulativeLast won't be able to overflow in soroban due to the  `overflow-checks = true`. Also, there are no bigger slots in Soroban. See https://soroban.stellar.org/docs/learn/built-in-types#primitive-types..

Following Uniswap official audit comments:
https://rskswap.com/audit.html#orgc9b3190
In the case of the accumulators, it is instead a safety measure: a revert on overflow could cause a liveness failure (a revert in _update would block trades, and LP entry and exit). 

It is needed that price0CumulativeLast can overflow, in order to avoid the protocol to panic. In the audit they do a simulation:
```
Assuming that the ratio of the reserves in a given pair will be the same as the ratio of the dollar prices of one wei of each token, we can solve for a example pair consisting of a 36 decimal token and a 2 decimal token where the unit value of the 2 decimal token is 100 times that of the 36 decimal token: giving ~8 months until overflow...

Authors of oracles that build upon the price accumulator functionality in the core should therefore take care that the their oracles do not introduce spikes or discontinuities in the reported price at the overflow point, if price accumulator overflow is a realistic possibility for the assets involved. 
```

**What this means for Soroswap?** This means that Soroswap should allow overflow, hence not using overflow-checks = true, but using `checked_fn` every time the overflow it is NOT DESIRED (all parts except for price0CumulativeLast)

- The reserves are stored using 112 bits for each token.
**For Soroswap:** We will use u64

**Implemented**

___
___

## Reserves Function: included!
```javascript
 function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
     _reserve0 = reserve0;
     _reserve1 = reserve1;
     _blockTimestampLast = blockTimestampLast;
 }
 ```
 In Soroswap: Currently, this is implemented in `get_rsrvs`.
 Will change the name to `get_reserves` and also return blockTimestampLast:
 
 https://github.com/soroswap/core/commit/40cb8e59e5a9c06da055deed231d9703d57e950b

Included in the code!

___
___

 ## Name of Pairs: included!

```
string public constant name = 'Uniswap V2';
string public constant symbol = 'UNI-V2';
```
Implemented:
```
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
## Mint (Deposit)
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
- Currently this function is called `deposit`. In order not to make confusions with the `mint` function of the token token interface we will continue using `deposit` as the function name.
- This function uses reentrancy guard. Currently in Soroban it is not possible to do reentrancy (for now)... So for now, reentrancy guard it is not implementad.

- On UniswapV2 this function asumes that the tokens where already sent by the user... which in fact it is done by the Router contract... and it is with the Router contract that the user needs to approve its tokens to be spent. In UniswapV2, the router contract sends (with approval) tokens from the user to the Pair contract before executing the `mint` function... This design it's not necesary in Soroban (read https://stellar.org/developers-blog/sorobans-technical-design-decisions-learnings-from-ethereum) because the tokens can be sent with `from.require_auth();;`... which it is checked in the token contract itself...... 

The problem here is... what happens if there is a token thar does noe implements `require_auth`??..
In that case we need can follow the Uniswap design and implement a `Router` with a `addLiquidity_with_transfer_from` and a normal `addLiquidity` with `require_auth` ... in order to bypass those cases where tokens did not implement `require_auth`

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

In the next iteration, when Periphery contracts will be implemented (see https://github.com/Uniswap/v2-periphery) this function will change and will require the tokens to be sent before executing the  `deposit` function.

- Implement `bool feeOn = _mintFee(_reserve0, _reserve1);` DONE
- `uint _totalSupply = totalSupply;` in Soroban token interface there is no such `totalSupply`, hence we implement a `get_total_shares` and a `put_total_shares` function.
- UniswapV2Pair copares wether totalSupply==0 in order to send the "first" LP with sqrt(x*y), this is because UniswapV2Pair mints a MINIMUM_LIQUIDITY to the zero address in order to permanently lock it forever. The purpose of locking the MinLiq tokens is to establish a lower bound for the liquidity in the pool. This ensures that there is always some level of liquidity available, preventing scenarios where liquidity providers could fully drain a pool and leave it with no liquidity.
Uniswap takes this minimum liquidity as 1e-15 pool shares that are 1000 times the minimum quantity of pool shares (in Ethereum, UniswapV2LP tokens have 18 decimals, hence 1 token unit represent 1e-18)...
In the stellar/soroban-examples version of the liquidity_pool contract, this minimum liquidity is not implemented. 

To do something similar in Soroswap, we also mint 1000 times the minimum quantity of tokens, by also minting 10**3 as minimum liquidity. As Stellar classic asset have 7 decimals, Soroswap will also have 7 decimals (at least for this first version). This means that this minimum liquidity whould represent 1e-4 pool shares.

```
uint public constant MINIMUM_LIQUIDITY = 10**3;
```
        

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
## Skim
From UniswapV2 Whitepaper:

To protect against bespoke token implementations that can update the pair contract’s
balance, and to more gracefully handle tokens whose total supply can be greater than 2**2112,
Uniswap v2 has two bail-out functions: sync()and skim().

sync() functions as a recovery mechanism in the case that a token asynchronously
deflates the balance of a pair. In this case, trades will receive sub-optimal rates, and if no
liquidity provider is willing to rectify the situation, the pair is stuck. sync() exists to set
the reserves of the contract to the current balances, providing a somewhat graceful recovery
from this situation.

skim() functions as a recovery mechanism in case enough tokens are sent to an pair to
overflow the two uint112 storage slots for reserves, which could otherwise cause trades to
fail. skim() allows a user to withdraw the difference between the current balance of the
pair and 2**2112 − 1 to the caller, if that difference is greater than 0.


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


___
___

 ## Safe Transfer: not needed
 The `_safeTransfer` function is Solidity specific. No need to implement in Soroban
 ```javascript
 bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

 function _safeTransfer(address token, address to, uint value) private {
     (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
     require(success && (data.length == 0 || abi.decode(data, (bool))), 'UniswapV2: TRANSFER_FAILED');
 }
 ```
 ___
 ___

 ## Constructor: not needed
 In Soroban the `constructor()` and `initialize()` functions are the same.
 So no need to separate them.

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

