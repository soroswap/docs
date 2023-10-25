# The SoroswapRouter Contract

The `SoroswapRouter` contract is a smart contract on the Soroban blockchain that provides functions for token swapping and liquidity management in token pairs. It is designed for use in decentralized exchanges (DEX) and other DeFi applications on the Soroban platform.

## Initialization

### `initialize`

`initialize(e: Env, factory: Address)`

Initializes the router contract by setting the address of the factory contract, which manages pairs of tokens. This function should be called once to set up the router.

- `e` (Env): The contract environment.
- `factory` (Address): The address of the factory contract.

## Liquidity Management

### `add_liquidity`

`add_liquidity(e: Env, token_a: Address, token_b: Address, amount_a_desired: i128, amount_b_desired: i128, amount_a_min: i128, amount_b_min: i128, to: Address, deadline: u64) -> (i128, i128, i128)`

Adds liquidity to a token pair's pool, creating it if it doesn't exist. Ensures that exactly the desired amounts of both tokens are added, subject to minimum requirements. This function is responsible for transferring tokens from the user to the pool and minting liquidity tokens in return.

- `e` (Env): The contract environment.
- `token_a` (Address): The address of the first token.
- `token_b` (Address): The address of the second token.
- `amount_a_desired` (i128): The desired amount of the first token.
- `amount_b_desired` (i128): The desired amount of the second token.
- `amount_a_min` (i128): The minimum required amount of the first token.
- `amount_b_min` (i128): The minimum required amount of the second token.
- `to` (Address): The address where the liquidity tokens will be minted and sent.
- `deadline` (u64): The deadline for executing the operation.

Returns a tuple containing:
- `amount_a` (i128): The actual amount of the first token added to the pool.
- `amount_b` (i128): The actual amount of the second token added to the pool.
- `liquidity` (i128): The amount of liquidity tokens minted.
___

### `remove_liquidity`

`remove_liquidity(e: Env, token_a: Address, token_b: Address, liquidity: i128, amount_a_min: i128, amount_b_min: i128, to: Address, deadline: u64) -> (i128, i128)`

Removes liquidity from a pool of token pairs. It transfers liquidity tokens from the user to the pool and returns the corresponding amounts of the two tokens. 

- `e` (Env): The contract environment.
- `token_a` (Address): The address of the first token.
- `token_b` (Address): The address of the second token.
- `liquidity` (i128): The amount of liquidity tokens to remove.
- `amount_a_min` (i128): The minimum required amount of the first token.
- `amount_b_min` (i128): The minimum required amount of the second token.
- `to` (Address): The address where the removed tokens will be sent.
- `deadline` (u64): The deadline for executing the operation.

Returns a tuple containing:
- `amount_a` (i128): The actual amount of the first token received.
- `amount_b` (i128): The actual amount of the second token received.

## Token Swapping

### `swap_exact_tokens_for_tokens`

`swap_exact_tokens_for_tokens(e: Env, amount_in: i128, amount_out_min: i128, path: Vec<Address>, to: Address, deadline: u64) -> Vec<i128>`

Swaps an exact amount of input tokens for as many output tokens as possible. The swapping route is determined by the provided path, where the first element is the input token and the last is the output token.

- `e` (Env): The contract environment.
- `amount_in` (i128): The exact amount of input tokens to swap.
- `amount_out_min` (i128): The minimum required amount of output tokens.
- `path` (Vec<Address>): An array of token addresses representing the swap route.
- `to` (Address): The address where the output tokens will be sent.
- `deadline` (u64): The deadline for executing the operation.

Returns an array of amounts that represent the actual output tokens received.
___

### `swap_tokens_for_exact_tokens`
`swap_tokens_for_exact_tokens(e: Env, amount_out: i128, amount_in_max: i128, path: Vec<Address>, to: Address, deadline: u64) -> Vec<i128>`

Swaps tokens for an exact amount of output tokens. The swapping route is determined by the provided path, where the first element is the input token and the last is the output token.

- `e` (Env): The contract environment.
- `amount_out` (i128): The exact amount of output tokens to receive.
- `amount_in_max` (i128): The maximum allowed amount of input tokens.
- `path` (Vec<Address>): An array of token addresses representing the swap route.
- `to` (Address): The address where the input tokens will be taken from.
- `deadline` (u64): The deadline for executing the operation.

Returns an array of amounts that represent the actual input tokens used for the swap.

## Library Functions

These functions exist in the SoroswapRouter contract, but will use the SoroswapLibrary code:

### `router_quote`
`router_quote(amount_a: i128, reserve_a: i128, reserve_b: i128) -> i128`

Given some amount of an asset and pair reserves, returns an equivalent amount of the other asset.

- `amount_a` (i128): The input amount.
- `reserve_a` (i128): The reserve amount of the first asset.
- `reserve_b` (i128): The reserve amount of the second asset.

Returns the equivalent amount of the second asset.
___

### `router_get_amount_out`
`router_get_amount_out(amount_in: i128, reserve_in: i128, reserve_out: i128) -> i128`

Given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset.

- `amount_in` (i128): The input amount.
- `reserve_in` (i128): The reserve amount of the input asset.
- `reserve_out` (i128): The reserve amount of the output asset.

Returns the maximum output amount of the output asset.
___

### `router_get_amount_in`

`router_get_amount_in(amount_out: i128, reserve_in: i128, reserve_out: i128) -> i128`

Given an output amount of an asset and pair reserves, returns a required input amount of the other asset.

- `amount_out` (i128): The output amount.
- `reserve_in` (i128): The reserve amount of the input asset.
- `reserve_out` (i128): The reserve amount of the output asset.

Returns the required input amount of the input asset.

### `router_get_amounts_out`

```rust
fn router_get_amounts_out(e: Env, amount_in: i128, path: Vec<Address>) -> Vec<i128>
```
Performs chained `getAmountOut` calculations on any number of pairs. Given an input amount, it calculates the expected output amounts through the specified token path.

### `router_get_amounts_in`
```rust
fn router_get_amounts_in(e: Env, amount_out: i128, path: Vec<Address>) -> Vec<i128>
```
Performs chained `getAmountIn` calculations on any number of pairs. Given an output amount, it calculates the required input amounts through the specified token path.

These library functions are used in the router to facilitate various operations, such as estimating amounts, performing swaps, and managing liquidity. They play a crucial role in ensuring accurate and efficient token exchange within the Soroswap ecosystem.
