# Phoenix Protocol

## Multihop Swap

The Phoenix Protocol enables swaps across multiple liquidity pools through a specialized smart contract known as [Multihop](https://github.com/Phoenix-Protocol-Group/phoenix-contracts/tree/main/contracts/multihop). This section outlines the key features and usage of the Multihop contract.

### Swap Function Parameters

The primary function of interest in Multihop is `swap`, which accepts the following parameters:

- `recipient`: The address of the contract designated to receive the swapped amount.
- `referral`: An optional address for the referral entity. If provided, this entity receives a commission bonus for the swap. (Note: This feature is currently commented out in the contract.)
- `operations`: A vector (`Vec<Swap>`) detailing the swap operations, including addresses of the assets being asked for and offered.
- `max_belief_price`: An optional `i64` value representing the maximum price the user is willing to accept for the swap.
- `max_spread_bps`: An optional `i64` value indicating the maximum permitted spread (in basis points) between the asking and offering prices.
- `amount`: An `i128` value specifying the amount offered for the swap.

### Swap Struct

Multihop processes an array of `Swap` structures. Here is the `Swap` struct definition in Rust:

```rust
pub struct Swap {
    pub ask_asset: Address,
    pub offer_asset: Address,
}
```

For a successful operation, the contract iterates through this array, retrieves the corresponding pool address from the factory using `ask_asset` and `offer_asset`, and then executes the swaps. The array structure is crucial and should follow this pattern: `[{token_a, token_b}, {token_b, token_c}, {token_c, token_d}]`. If a user wishes to swap `token_a` for `token_d`, they must specify the intermediary pairs. A panic occurs if any pair lacks an existing liquidity pool.

### Swap Function Implementation

Below is a code snippet illustrating the implementation of the swap function:

```rust
let mut next_offer_amount: i128 = amount;
let factory_client = factory_contract::Client::new(&env, &get_factory(&env));

operations.iter().for_each(|op| {
  let liquidity_pool_addr: Address = factory_client
      .query_for_pool_by_token_pair(&op.clone().offer_asset, &op.ask_asset.clone());

  let lp_client = lp_contract::Client::new(&env, &liquidity_pool_addr);
  next_offer_amount = lp_client.swap(
      &recipient,
      &op.offer_asset,
      &next_offer_amount,
      &max_belief_price,
      &max_spread_bps,
  );
});
```

## Factory Contract

The factory contract is a crucial component of Phoenix Protocol, offering various functions to manage and retrieve information about liquidity pools:

### Key Functions

- `query_pools(env: Env) -> Vec<Address>`: Returns a vector of addresses for all pools.
- `query_pool_details(env: Env, pool_address: Address) -> LiquidityPoolInfo`: Retrieves details of a specific pool.
- `query_all_pools_details(env: Env) -> Vec<LiquidityPoolInfo>`: Obtains details for all pools.
- `query_for_pool_by_token_pair(env: Env, token_a: Address, token_b: Address) -> Address`: Fetches the address of a specific pool based on token pair addresses.

The Multihop contract predominantly uses `query_for_pool_by_token_pair()` to acquire the address of a specific liquidity pool based on the provided token addresses.