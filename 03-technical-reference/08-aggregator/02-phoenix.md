# Phoenix Protocol Multihop swap

Phoenix protocol to perform swap across multiple pools have their own smart contract called [Multihop](https://github.com/Phoenix-Protocol-Group/phoenix-contracts/tree/main/contracts/multihop).

The swap function which is the one we are interested on receives for params:
```
recipient: Address of the contract that will receive the amount swapped.
referral: Option<Address> of the referral, that will get a referral commission bonus for the swap, is currently commented in the contract.
operations: Vec<Swap> that holds both the addresses of the asked and offer assets.
max_belief_price: Option<i64> value for the maximum believe price that will be used for the swaps.
max_spread_bps: Option<i64> maximum permitted difference between the asked and offered price in BPS.
amount: i128 value representing the amount offered for swap
```

This multihop receives an array of Swaps here is the swap struct
```rust
pub struct Swap {
    pub ask_asset: Address,
    pub offer_asset: Address,
}
```
The contract then loops through this array and gets the pool address from the factory by providing the ask_asset and offer_asset, then performs the swaps. This array has to be structured like this `[{token_a, token_b}, {token_b, token_c}, {token_c, token_d}]` so if i want to swap `token_a` for `token_d` i need to tell the multihop what pairs it needs to use, if i pass pairs that doesn't have a existent liquidity pool it should panic.

here is a snippet of the swap function
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