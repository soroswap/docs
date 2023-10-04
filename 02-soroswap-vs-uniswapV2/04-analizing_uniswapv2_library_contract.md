# The Library Contract: Comparison between Soroswap and UniswapV2

The `UniswapV2Library` contract is a contract that helps the router, or any other Uniswap Client Contract to interact with the `Pair` contract. It helps sort tokens (remember that for the pair contract it's not the same token0 than token1), get reserves for an specific pair, and calculates the optimal in/out amount someone needs to send to swap an specific quantity of an specific token.

In the following we are going to analize each function or characteristic of the `UniswapV2Library` contract, originally written in Solidity for EVM's, and we are going to think on how we could implement those functionalities and functions in rust for Soroban:

## Safe Math:

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

## The `sortTokens` function:

This function returns sorted token addresses, used to handle return values from pairs sorted in this  order.

In Solidity the code is like this:
```javascript
function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }
```
As you can see on our SoroswapPair contract, we have imposed that:
```rust 
if token_a >= token_b {
            panic!("token_a must be less than token_b");
        }
```
Hence, we will implement an order of this type.

Regarding the zero address, in Soroban there is no such as zero address ([read this discussion](https://discord.com/channels/897514728459468821/1077831317175144528/1077831317175144528)), so the last `require` statement won't be implemented.

## The `pairFor` function
This function calculates the CREATE2 address for a pair without making any external calls. This is because UniswapV2Factory uses the CREATE2 opcode by carefully selecting a unique salt value in order to have a deterministic contract address for each (factory, token0, token1) combination (and of course the same pair contract code)

The whole idea of this function is to avoid an external call to the Factory contract in order to ask it what the pair address is... In Soroban this external call won't be expensive... and it's not event direct that calculating this address will be cheaper than the external call

Can we do the same with Soroban? The answer is **yes!**

In our SoroswapFactory contract, when we deploy a new Pair contract, we do it like this:

```
e.deployer()
    .with_current_contract(token_pair.salt(&e)) // Use the salt as a unique identifier for the new contract instance
    .deploy(pair_wasm_hash) // Deploy the new contract instance using the given pair_wasm_hash value
```

Here, the `salt` is an unique identifier that will be used to calculate the new smart contract address. In fact, the new smart contract address depends only in the combination of **the deployer address and the salt**.

In fact, in the `salt` in the factory is created by a combination of the `token_0` and `token_1` address:

```rust
impl Pair {
    pub fn new(a: Address, b: Address) -> Self {
        if a < b {
            Pair(a, b)
        } else {
            Pair(b, a)
        }
    }

    pub fn salt(&self, e: &Env) -> BytesN<32> {
        let mut salt = Bytes::new(e);

        // Append the bytes of token_a and token_b to the salt
        salt.append(&self.0.clone().to_xdr(e)); // can be simplified to salt.append(&self.clone().to_xdr(e)); but changes the hash
        salt.append(&self.1.clone().to_xdr(e));

        // Hash the salt using SHA256 to generate a new BytesN<32> value
        e.crypto().sha256(&salt)
    }

    pub fn token_a(&self) -> &Address {
        &self.0
    }

    pub fn token_b(&self) -> &Address {
        &self.1
    }
}
```

If you want to be sure about what we say here, please check this playground repo: https://github.com/paltalabs/deterministic-address-soroban

So, in Soroban we can also calculate the pair contract address without doing a cross-contract call to the Factory contract, we just need the salt explined above + the Factory address like this:

```rust
pub fn calculate_address(
    env: Env, 
    deployer: Address,
    salt: BytesN<32>,
) -> Address {
   
    let deployer_with_address = env.deployer().with_address(deployer.clone(), salt);
    
    // Calculate deterministic address:
    // This function can be called at anytime, before or after the contract is deployed, because contract addresses are deterministic.
    // https://docs.rs/soroban-sdk/20.0.0-rc2/soroban_sdk/deploy/struct.DeployerWithAddress.html#method.deployed_address
    let deterministic_address = deployer_with_address.deployed_address();
    deterministic_address
}
```

## The `getReserves` function
This function fetches and sorts the reserves for a pair. 

It's code in Solidity is:
```javascript
function getReserves(address factory, address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {
        (address token0,) = sortTokens(tokenA, tokenB);
        (uint reserve0, uint reserve1,) = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }
```

It is a set of simple external and internal function calls, so it will be easy to implement in Soroban


## The `quote` function
This function given some amount of an asset and pair reserves, returns an equivalent amount of the 
other asset

It's code in Solidity is: 

```javascript
function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {
        require(amountA > 0, 'UniswapV2Library: INSUFFICIENT_AMOUNT');
        require(reserveA > 0 && reserveB > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');
        amountB = amountA.mul(reserveB) / reserveA;
    }
```

It's a set of restrictions and arithmetics operations, so it will be implemented in Soroban without any problem.


## The `getAmount...` functions
There are four important functions in Uniswap's code: `getAmountOut`, `getAmountIn`, `getAmountsOut` and `getAmountsIn` that are similar. These functions are used for making trades and managing liquidity in Uniswap.

- `getAmountOut`` calculates how much of one token you can get when you put in another token, considering fees and available reserves.

- `getAmountIn` does the opposite, determining how much you need to put in to get a specific amount of another token.

- `getAmountsOut` and `getAmountsIn`` help with more complex trades that involve multiple steps, like going from Token A to Token B to Token C. They make sure you get the right amount at each step.

These operations involve  math and checks. These same operations can be easily recreated in Rust and Soroban.