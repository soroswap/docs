# Comparison of Soroswap and UniswapV2 Pair Contracts: Part 2

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

Currently, reentrancy it's not allowed inside Soroban:
Check here: <https://github.com/esteblock/reentrancy-soroban>  
And here: <https://discord.com/channels/897514728459468821/993874836336152576>  

We will need to come back to this later if reentrancy will be allowed

**status: Not implemented for the moment**

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
where we can see that we used the `checked_add`, `checked_sub`, `checked_mult` and `checked_div` functions to avoid overflow.

Included in the code!

___
___
## Oracles  
To be written

___
___
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