# Comparison of Soroswap and UniswapV2 Pair Contracts: Part 2

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
```

For now, Soroban does not permit reentrancy. Further information is available at these sources:
- <https://github.com/esteblock/reentrancy-soroban>  
- <https://discord.com/channels/897514728459468821/993874836336152576>  

We plan to revisit this aspect if the allowance of reentrancy is considered in the future.

**Current Status: Not implemented**

___
___

## Protocol Fee Mechanism: Mint Fee Implemented!

Uniswap V2 incorporates a protocol fee of 0.05%, which can be toggled on or off. When activated, this fee is routed to 
an address, `feeTo`, specified in the factory contract. Initially, `feeTo` isn't set, and hence, no fees are collected. 
There is a designated address, `feeToSetter`, with the power to invoke the `setFeeTo` function on the Uniswap V2 
factory contract, altering the `feeTo` value. `feeToSetter` can also change its own address via the `setFeeToSetter` 
function.


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
In this code, we have utilized the `checked_add`, `checked_sub`, `checked_mult` and `checked_div` functions to prevent 
potential overflows.

**This functionality has been successfully integrated into the code!**
___
___
## Oracles:  
<!---
TODO: see how is implement in our codebase
THIS SECTION HAS NOT BEEN REVIEWED YET
--->

The marginal price of a token pair is calculated by dividing the reserve of one token by the reserve of the other token.
Since arbitrageurs will trade against the pair contract to make profits, the marginal price of the pair contract will 
follow 
the market price.

<!---
Write why we need oracles
--->


<!---
Write how oracles works in UniswapV2
--->

### A note on arithmetic operations and data types:

The design of oracle functions requieres some consideration to arithmetic operations and data types, given that 
neither Solidity nor Soroban support floating point numbers or non-integer number data types natively. Both systems employ 
custom-made fixed-point number data types, conforming to the [Q format](https://en.wikipedia.org/wiki/Q_(number_format)),
which are stored as integers. 

The Q format is a [fixed-point number](https://en.wikipedia.org/wiki/Fixed-point_arithmetic)
format that specifies the number of bits used for the integer and fractional parts. Both UniswapV2 and Soroswap utilize
 the **unsigned** variant of the Q format, called UQ, only diverging in the number of bits assigned for the integer and
fractional components. 

A UQn.m number is stored as an unsigned integer of n+m bits, where the first n bits are used for the integer part, and 
the last m bits are used for the fractional part. 

For the sake of ilustration, suppose that we have a UQ4.4 format. It means
that we are using 4 bits for the integer part and 4 bits for the fractional part. The whole number is stored in an 8-bit unsigned integer.
Some examples of UQ4.4 numbers are:
 - The number 1.5 in UQ4.4 format is represented as 00011000 in binary. The first four bits (0001) represent the 
  integer part 1, and the last four bits (1000) represent the fractional part 0.5.

- The number 3.75 in UQ4.4 format is represented as 00111100 in binary. The first four bits (0011) represent the integer
   part 3, and the last four bits (1100) represent the fractional part 0.75.

To convert the binary number back to a decimal number, we divide the value represented by the fractional part by 2 to 
the power of m. In the case of UQ4.4 format, we divide by 2^4 = 16. So, 00011000 would be converted to 1 (from the 
integer part) plus 8/16 (from the fractional part), or 1.5.

In the case of UniswapV2, the [UQ112.112](https://github.com/Uniswap/v2-core/blob/master/contracts/libraries/UQ112x112.sol)
 is used, in contrast to the UQ64.64  used in Soroswap whose implementation is on 
<https://github.com/esteblock/fractions-soroban>

<!---
Are we going to use UniswapV2 or UniswapV3 Oracle function?

--->

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
- Balances need to fit within the uint112 data type in order to be encoded into UQ112x112 and undergo division 
operations.
**For Soroswap:** Balances will need to git within a u64 type to be encoded into UQ64X64

- Block timestamps are obtained by using the modulo operator to fit them within the uint32 data type. This is done for 
gas optimization purposes, as described in the whitepaper. Consequently, each set of 224-bit reserves (two reserves os 
112-bit) is accompanied by a 32-bit timestamp within a single 256-bit storage slot.
**For Soroswap:** We won't pay much attention for now in gas usage.  Can be u32 or u64


- The block timestamp has the potential to overflow, with the next overflow occurring on 02/07/2106. Oracles are 
required to account for this and ensure proper functionality by checking prices at least once within each interval of 2^
32 - 1 seconds (approximately 136 years).
**For Soroswap: ** Block timestamp can be stored in u64, and will overflow in the year 2554, so we are safe.

- The variables price0CumulativeLast and price1CumulativeLast are stored using 224 bits each, because they hold a sum 
and multitplications of UQ112X112.
**For Soroswap:** price0CumulativeLast will need to be u128


- The price itself will not overflow, but the accumulated price over an interval may exceed the 224-bit limit. To 
address this, an additional 32 bits are allocated in the storage slots for the accumulated prices of token A/token B 
and token B/token A. These extra bits handle any overflow resulting from repeated summations of prices.
**For Soroswap:** By default price0CumulativeLast won't be able to overflow in soroban due to the  `overflow-checks = 
true`. Also, there are no bigger slots in Soroban. See https://soroban.stellar.org/docs/learn/built-in-types#primitive-
types..

Following Uniswap official audit comments:
https://rskswap.com/audit.html#orgc9b3190
In the case of the accumulators, it is instead a safety measure: a revert on overflow could cause a liveness failure (a 
revert in _update would block trades, and LP entry and exit). 

It is needed that price0CumulativeLast can overflow, in order to avoid the protocol to panic. In the audit they do a 
simulation:
```
Assuming that the ratio of the reserves in a given pair will be the same as the ratio of the dollar prices of one wei 
of each token, we can solve for a example pair consisting of a 36 decimal token and a 2 decimal token where the unit 
value of the 2 decimal token is 100 times that of the 36 decimal token: giving ~8 months until overflow...

Authors of oracles that build upon the price accumulator functionality in the core should therefore take care that the 
their oracles do not introduce spikes or discontinuities in the reported price at the overflow point, if price 
accumulator overflow is a realistic possibility for the assets involved. 
```

**What this means for Soroswap?** This means that Soroswap should allow overflow, hence not using overflow-checks = 
true, but using `checked_fn` every time the overflow it is NOT DESIRED (all parts except for price0CumulativeLast)

- The reserves are stored using 112 bits for each token.
**For Soroswap:** We will use u64

**Implemented**

___
___
___
___
## Skim


From UniswapV2 Whitepaper:

To protect against bespoke token implementations that can update the pair contract’s
balance, and to more gracefully handle tokens whose total supply can be greater than $2^{112}$,
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

```rust
  // force balances to match reserves
    fn skim(e: Env, to: Address) {
        let (balance_0, balance_1) = (get_balance_0(&e), get_balance_1(&e));
        let (reserve_0, reserve_1) = (get_reserve_0(&e), get_reserve_1(&e));
        transfer_token_0_from_pair(&e, to.clone(), balance_0.checked_sub(reserve_0).unwrap());
        transfer_token_1_from_pair(&e, to, balance_1.checked_sub(reserve_1).unwrap());
    }
```


___
___

 ## Safe Transfer: not needed
 The `_safeTransfer` function is specific to Solidity and isn't necessary to be implemented in Soroban.

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