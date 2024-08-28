# SoroswapLibrary:

The SoroswapLibrary is a rust crate that anyone can implement in their smart contracts. Check all the documentation here: [https://docs.rs/soroswap-library/latest/soroswap\_library/](https://docs.rs/soroswap-library/latest/soroswap\_library/)



### Code

You can find the Soroswap library code on the [Soroswap GitHub repository](https://github.com/soroswap/core/tree/main/contracts/library).  in [https://github.com/soroswap/core/tree/main/contracts/library](https://github.com/soroswap/core/tree/main/contracts/library)





### Usage as a crate



1.- Add this to your Cargo.toml:

\[dependencies] soroswap-library = ""

2.- Import it:

```
use soroswap_library;
```

3.- Use it:

```
let quote = soroswap_library::quote(amount_a, reserve_a, reserve_b)

```

### Internal Functions

#### sort\_tokens

```rust
fn sort_tokens(token_a: Address, token_b: Address) -> (Address, Address);
```

Sorts token addresses.

#### pair\_for

```rust
fn pair_for(e: Env, factory: Address, token_a: Address, token_b: Address) -> Address;
```

Calculates the address for a pair without making any external calls.

#### get\_reserves

```rust
fn get_reserves(e: Env, factory: Address, token_a: Address, token_b: Address) -> (i128, i128);
```

Fetches and sorts the reserves for a pair.

#### quote

```rust
fn quote(amount_a: i128, reserve_a: i128, reserve_b: i128) -> i128;
```

Given some asset amount and reserves, returns an amount of the other asset representing an equivalent value.

* Useful for calculating optimal token amounts before calling `deposit`.

#### get\_amount\_out

```rust
fn get_amount_out(amount_in: i128, reserve_in: i128, reserve_out: i128) -> i128;
```

Given an input asset amount, returns the maximum output amount of the other asset (accounting for fees) given reserves.

* Used in `get_amounts_out`.

#### get\_amount\_in

```rust
fn get_amount_in(amount_out: i128, reserve_in: i128, reserve_out: i128) -> i128;
```

Returns the minimum input asset amount required to buy the given output asset amount (accounting for fees) given reserves.

* Used in `get_amounts_in`.

#### get\_amounts\_out

```rust
fn get_amounts_out(e: Env, factory: Address, amount_in: i128, path: Vec<Address>) -> Vec<i128>;
```

Given an input asset amount and an array of token addresses, calculates all subsequent maximum output token amounts by calling `get_reserves` for each pair of token addresses in the path in turn and using these to call `get_amount_out`.

* Useful for calculating optimal token amounts before calling `swap`.

#### get\_amounts\_in

```rust
fn get_amounts_in(e: Env, factory: Address, amount_out: i128, path: Vec<Address>) -> Vec<i128>;
```

Given an output asset amount and an array of token addresses, calculates all preceding minimum input token amounts by calling `get_reserves` for each pair of token addresses in the path in turn and using these to call `get_amount_in`.

* Useful for calculating optimal token amounts before calling `swap`.

This Soroswap library is designed to facilitate efficient and precise token swapping and handling in the Soroswap.Finance ecosystem. It includes a range of functions to support various aspects of token management, from sorting token addresses to calculating reserves and performing chained calculations for different pairs. These functions are crucial for the optimal functioning of Soroswap in the Stellar network.
