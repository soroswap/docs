# Experiment the Factory contract
Once you are inside the `soroban-preview-8` container (by `bash quickstart.sh` and `bash run.sh`) you can start experimenting with the SoroswapFactory contract.

Remember that the Factory contract will help users to create new Pair contracts that will act as liquidity pools for every pair of `(token_a, token_b)` pair:

## 1. Open and read the contract:
Open in your favourite IDE or text editor, and check the `factory` folder:

In the `factory/src` folder you will find:
- The `lib.rs` file with the `SoroswapFactory` functions
- The `pair.rs` file that basically imports the pair contract `wasm` from the `core/pair` folder
- The `event.rs` file that defines the events that will be trigered
- The `test.rs` file.

## 2. Compile the contract
You can compile both contracts by just calling `make build` from the root directory, however, we can go contract by contract:
```
cd factory
make build
```

## 3. Read and run the tests:
```bash
make test
```


### 1.- First, set your enviromental variables
Read step 1) from the previous chapter

### 2.- Let's create two dummy tokens:
Read step 2) from the previous chapter

### 3.- Build both the Pair and the Factory contract
And set the `FACTORY_WASM` and `PAIR_WASM` that will tell where to find the build wasm for each contract:

```bash
make build
FACTORY_WASM="factory/target/wasm32-unknown-unknown/release/soroswap_factory_contract.wasm"
PAIR_WASM="pair/target/wasm32-unknown-unknown/release/soroswap_pair_contract.wasm"
```

### 4.- Install the Pair contract WASM
The Factory contract will deploy several instances of the Pair contract (one for each pair), so it requires that the pair contract has been installed in the ledger (but not necesarilly deployed!). Then, the Factory will use the `pair wasm hash` of the installed contract to deploy new instances of the Pair contract.

```bash
echo Install the Pair contract WASM
echo Install a WASM file to the ledger without creating a contract instance

PAIR_WASM_HASH="$(
soroban contract install $ARGS \
  --wasm $PAIR_WASM
)"
echo "$PAIR_WASM_HASH" > .soroban/pair_wasm_hash
echo "SoroswapPair installed succesfully with PAIR_WASM_HASH: $PAIR_WASM_HASH"

```

### 5.- Deploy and initialize the Factory contract
```bash

echo Deploy the Factory contract
FACTORY_ID="$(
  soroban contract deploy $ARGS \
    --wasm $FACTORY_WASM
)"
echo "$FACTORY_ID" > .soroban/factory_id
echo "SoroswapFactory deployed succesfully with FACTORY_ID: $FACTORY_ID"

echo "Initialize the SoroswapFactory contract"
soroban contract invoke \
  $ARGS \
  --wasm $FACTORY_WASM \
  --id $FACTORY_ID \
  -- \
  initialize \
  --setter "$TOKEN_ADMIN_ADDRESS" \
  --pair_wasm_hash "$PAIR_WASM_HASH" 
```

### 6.- Create a Pair contrract using the SoroswapFactory contract.
By calling the `create_pair` function inside the `SoroswapFactory` contract, the Factory will create a new Pair contract, and it will return its contract id:

```bash
echo "Create a pair using the SoroswapFactory contract, token_a and token_b"
PAIR_ID=$(soroban contract invoke \
  $ARGS \
  --wasm $FACTORY_WASM \
  --id $FACTORY_ID \
  -- \
  create_pair \
  --token_a "$TOKEN_A_ID" \
  --token_b "$TOKEN_B_ID" )
# Assuming the variable PAIR_ID contains the returned ID with apostrophes
PAIR_ID=$(echo $PAIR_ID | tr -d '"')
echo Pair created succesfully with PAIR_ID=$PAIR_ID
echo $PAIR_ID > .soroban/pair_id

echo "--"
echo "--"
```

You might want to call the `all_pairs_length` and `get_pair` functions to test that they work as expected:

```bash
echo Test that now there is 1 pair
soroban contract invoke \
  $ARGS \
  --wasm $FACTORY_WASM \
  --id $FACTORY_ID \
  -- \
  all_pairs_length \

echo We should be able to get the same PAIR_ID calling to get_pair function:
soroban contract invoke \
  $ARGS \
  --wasm $FACTORY_WASM \
  --id $FACTORY_ID \
  -- \
  get_pair \
  --token_a "$TOKEN_A_ID" \
  --token_b "$TOKEN_B_ID" 

echo Also if we ask for the inverse order

soroban contract invoke \
  $ARGS \
  --wasm $FACTORY_WASM \
  --id $FACTORY_ID \
  -- \
  get_pair \
  --token_a "$TOKEN_B_ID" \
  --token_b "$TOKEN_A_ID" 


```

### 7.-  Test the Pair contract.
Now that a new Pair contract has been deployed by the Factory contract, it should behave as seen in the previous chapter. So, once you have the Pair contract_id given in step (6) now you can test all its functions.

In order to do this, please follow steps 5-7 from the previous chapter:

___

If you want to continue experimenting directly with the CLI, here aresome env variable setting that might be useful <3

```bash
ARGS="--network $NETWORK --source token-admin"
PAIR_WASM="pair/target/wasm32-unknown-unknown/release/soroswap_pair_contract.wasm"
PAIR_ID=$(cat .soroban/pair_wasm_hash)
TOKEN_ADMIN_ADDRESS=$(cat .soroban/token_admin_address)
USER_ADDRESS=$(cat .soroban/user_address)
TOKEN_A_ID=$(cat .soroban/token_a_id)
TOKEN_B_ID=$(cat .soroban/token_b_id)
ARGS_USER="--network $NETWORK --source user"


echo In the next we will use:
echo ARGS = $ARGS
echo ARGS_USER = $ARGS_USER
echo PAIR_WASM = $PAIR_WASM
echo PAIR_ID = $PAIR_ID
echo TOKEN_ADMIN_ADDRESS = $TOKEN_ADMIN_ADDRESS
echo USER_ADDRESS = $USER_ADDRESS
echo TOKEN_A_ID = $TOKEN_A_ID
echo TOKEN_B_ID = $TOKEN_B_ID
echo "--"
echo "--"
```
___

You can go through all this steps just by doing:
```bash
bash initialize_pair.sh
```
