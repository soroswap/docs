# Experiment the Pair contract
Once you are inside the `soroban-preview-8` container (by `bash quickstart.sh` and `bash run.sh`) you can start experimenting with the SoroswapPair contract.

## 1. Open and read the contract:
Open in your favourite IDE or text editor, and check the `pair` folder:

In the `pair/src` folder you will find:
- The `lib.rs` file with the `SoroswapPair` functions

- The `token` folder, which is a fork of the `token` contract from `soroban-examples`, with two added functions: The `internal_burn` and the `internal_mint` function.
As the `SoroswapPair` contract is a token itself, if it's not making a cross-contract call to iself in order to mint or burn tokens, it will have problems with `require_auth`. Read more about this in the following issue: [#16](https://github.com/soroswap/core/issues/16)

- The `test.rs`. 
- The `create` folder, that contains the `create mod`, used in testings in order to create the pair contract.

Also, you will see that in the root folder, there is a `./soroban_token_contract.wasm` file. This was taken by compiling the []`soroban-examples/token contract v0.7.0`](https://github.com/stellar/soroban-examples/releases/tag/v0.7.0)


## 2. Compile the contract
We can compile both contracts by just calling `make build` from the root directory, however, we can go contract by contract:
```
cd pair
make build
```

## 3. Read and run the tests:
```bash
make test
```

## 4.- Experiment with the SoroswapFactory contract using the soroban CLI:
You can see the followng step-by-step. However, if you decide you can read and just run the `initialize_factory.sh` contract:

```
bash initialize_pair.sh
```

### 1.- First, set your enviromental variables
Here, as we are using the `soroban-network` docker network, containers can call each other just using their name. In the case of the stellar quickstart container, it's name is `stellar`:

```bash
NETWORK="standalone"
SOROBAN_RPC_HOST="http://stellar:8000"
SOROBAN_RPC_URL="$SOROBAN_RPC_HOST/soroban/rpc"
SOROBAN_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
FRIENDBOT_URL="$SOROBAN_RPC_HOST/friendbot"

echo Add the $NETWORK network to cli client
  soroban config network add "$NETWORK" \
    --rpc-url "$SOROBAN_RPC_URL" \
    --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE"

echo Create the token-admin identity
  soroban config identity generate token-admin

TOKEN_ADMIN_SECRET="$(soroban config identity show token-admin)"
TOKEN_ADMIN_ADDRESS="$(soroban config identity address token-admin)"

echo "We are using the following TOKEN_ADMIN_ADDRESS: $TOKEN_ADMIN_ADDRESS"
echo "$TOKEN_ADMIN_SECRET" > .soroban/token_admin_secret
echo "$TOKEN_ADMIN_ADDRESS" > .soroban/token_admin_address

echo Fund token-admin account from friendbot
  echo This will fail if the account already exists, but it\' still be fine.
  curl  -X POST "$FRIENDBOT_URL?addr=$TOKEN_ADMIN_ADDRESS"

ARGS="--network $NETWORK --source token-admin"
echo "Using ARGS: $ARGS"
```

### 2.- Let's create two dummy tokens:

We need to create 2 tokens in order to interact with the Pair contract
```bash
mkdir -p .soroban
PAIR_WASM="pair/target/wasm32-unknown-unknown/release/soroswap_pair_contract.wasm"
TOKEN_WASM="soroban_token_contract.wasm"

echo Deploying TOKEN_A
  TOKEN_A_ID="$( soroban contract deploy $ARGS --wasm $TOKEN_WASM)"

echo "Initializing TOKEN_A. Executing:
    fn initialize(e: Env, admin: Address, decimal: u32, name: Bytes,symbol: Bytes)"

  soroban contract invoke \
  $ARGS \
  --wasm $TOKEN_WASM \
  --id $TOKEN_A_ID \
  -- \
  initialize \
  --admin "$TOKEN_ADMIN_ADDRESS" \
  --decimal 7 \
  --name 'AA' \
  --symbol 'AA'
  echo "--"
  echo "--"


echo Deploying TOKEN_B
  TOKEN_B_ID="$(soroban contract deploy $ARGS --wasm $TOKEN_WASM)"
  
echo Initializing TOKEN_B

  soroban contract invoke \
  $ARGS \
  --wasm $TOKEN_WASM \
  --id $TOKEN_B_ID \
  -- \
  initialize \
  --admin "$TOKEN_ADMIN_ADDRESS" \
  --decimal 7 \
  --name 'BB' \
  --symbol 'BB'
  echo "--"
  echo "--"

echo Current TOKEN_A_ID: $TOKEN_A_ID
echo Current TOKEN_B_ID: $TOKEN_B_ID
```

Because the Pair token always uses token_a and token_b so `token_a<token_b`, this is something we need to check before initializing the pair contract with our two tokens. Later, this is something that will be done automatically by the Factory contract:

```bash
if [[ "$TOKEN_B_ID" > "$TOKEN_A_ID" ]]; then
  echo "TOKEN_B_ID is greater than TOKEN_A_ID"
  echo "This is the correct order"
else
  echo "TOKEN_B_ID is less than or equal to TOKEN_A_ID"
  echo "We will invert the order of the tokens"
  TOKEN_A_ID_NEW=$TOKEN_B_ID
  TOKEN_B_ID=$TOKEN_A_ID
  TOKEN_A_ID=$TOKEN_A_ID_NEW

fi
echo Current TOKEN_A_ID: $TOKEN_A_ID
echo Current TOKEN_B_ID: $TOKEN_B_ID
  echo "--"
  echo "--"


echo -n "$TOKEN_A_ID" > .soroban/token_a_id
echo -n "$TOKEN_B_ID" > .soroban/token_b_id
```

### 3.- Build, deploy and initialize the Pair contract
```bash
echo Build the SoroswapPair contract
    cd pair
    make build
    cd ..
    PAIR_WASM="pair/target/wasm32-unknown-unknown/release/soroswap_pair_contract.wasm"
echo "--"

echo Deploy the Pair 
    PAIR_ID="$(soroban contract deploy $ARGS --wasm $PAIR_WASM)"
echo "$PAIR_ID" > .soroban/pair_wasm_hash
echo "SoroswapPair deployed succesfully with PAIR_ID: $PAIR_ID"
echo "--"

echo "Initialize the Pair contract using the Admin address as Factory"
echo "Calling: fn initialize_pair( e: Env, factory: Address, token_a: BytesN<32>, token_b: BytesN<32>);"

soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM \
  --id $PAIR_ID \
  -- \
  initialize_pair \
  --factory "$TOKEN_ADMIN_ADDRESS" \
  --token_a "$TOKEN_A_ID" \
  --token_b "$TOKEN_B_ID" 
```
### 4.- Creare a USER account and mint tokens to that account.
```bash
echo In the following we are going to use a new USER account:
  echo Creating the user identity
  soroban config identity generate user
  USER_SECRET="$(soroban config identity show user)"
  USER_ADDRESS="$(soroban config identity address user)"
  echo "We are using the following USER_ADDRESS: $USER_ADDRESS"
  echo "$USER_SECRET" > .soroban/user_secret
  echo "$USER_ADDRESS" > .soroban/user_address

echo Fund user account from friendbot
    echo This will fail if the account already exists, but it\' still be fine.
    curl  -X POST "$FRIENDBOT_URL?addr=$USER_ADDRESS"

  
echo "Mint 1000 units of token A user -- calling from TOKEN_ADMIN"

soroban contract invoke \
  $ARGS \
  --wasm $TOKEN_WASM \
  --id $TOKEN_A_ID \
  -- \
  mint \
  --admin "$TOKEN_ADMIN_ADDRESS" \
  --to "$USER_ADDRESS" \
  --amount "1000" 

echo "Mint 1000 units of token B to user"

soroban contract invoke \
  $ARGS \
  --wasm $TOKEN_WASM \
  --id $TOKEN_B_ID \
  -- \
  mint \
  --admin "$TOKEN_ADMIN_ADDRESS" \
  --to "$USER_ADDRESS" \
  --amount "1000" 

echo "Check that user has 1000 units of each token"
echo "Check TOKEN_A"
soroban contract invoke \
  $ARGS \
  --wasm $TOKEN_WASM\
  --id $TOKEN_A_ID \
  -- \
  balance \
  --id $USER_ADDRESS

echo "Check TOKEN_A"
soroban contract invoke \
  $ARGS \
  --wasm $TOKEN_WASM\
  --id $TOKEN_B_ID \
  -- \
  balance \
  --id $USER_ADDRESS
```
### 5.- Deposit tokens in the PAIR contract

Now is the fun part! Interacting with our pair contract!!!
```bash
echo "Deposit these tokens into the Pool contract"
    echo "This will be called by the user"
    ARGS_USER="--network standalone --source user"
    echo "Hence we use ARG_USER: $ARGS_USER"
echo "Calling: fn deposit( e: Env, 
                to: Address,
                desired_a: i128, 
                min_a: i128, 
                desired_b: i128, 
                min_b: i128)"

soroban contract invoke \
  $ARGS_USER \
  --wasm $PAIR_WASM \
  --id $PAIR_ID \
  -- \
  deposit \
  --to "$USER_ADDRESS" \
  --desired_a 100 \
  --min_a 100 \
  --desired_b 100 \
  --min_b 100

```

After this, you should receive a `sucess` message... But how do we know that we actually deposited 100 units of each token? The user shoud have new pair tokens, and it should have 100 token_a less and 100 token_b less!

```bash
echo Check that the user\'s pair tokens balance is 100

echo "Check PAIR_ID"
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $PAIR_ID \
  -- \
  balance \
  --id $USER_ADDRESS

echo Now the user should have: 900 units of TOKEN_A
echo "Check user\'s TOKEN_A balance"
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_A_ID \
  -- \
  balance \
  --id $USER_ADDRESS

echo Now the user should have: 900 units of TOKEN_B
echo "Check user\'s TOKEN_B balance"
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_B_ID \
  -- \
  balance \
  --id $USER_ADDRESS

echo And the Pair contract should hold:
PAIR_CONTRACT_ADDRESS="{\"address\": {\"contract\":\"$PAIR_ID\"}}"

echo 100 tokens of TOKEN_A
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_A_ID \
  -- \
  balance \
  --id "$PAIR_CONTRACT_ADDRESS"

echo 100 tokens of TOKEN_B
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_B_ID \
  -- \
  balance \
  --id "$PAIR_CONTRACT_ADDRESS"


echo And none of its own tokens -- the pair tokens --
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $PAIR_ID \
  -- \
  balance \
  --id "$PAIR_CONTRACT_ADDRESS"
echo "--"
echo "--"
echo "--"
echo "--"
```



### 6.- Swap tokens.
Once the SoroswapPair contract (which is a liquidity pool) has been initialized with some units of token_a and token_b, any user can perform a trade executing the `swap` function.

Here we will call the `fn swap(e: Env, to: Address, buy_a: bool, out: i128, in_max: i128)` function.   If "buy_a" is true, the swap will buy token_a and sell token_b. This is flipped if "buy_a" is false "out" is the amount being bought, with in_max being a safety to make sure you receive at least that amount. The swap function will transfer the selling token "to" to this contract, and then the contract will transfer the buying token to "to".

```bash

echo Now we will SWAP 

soroban contract invoke \
  $ARGS_USER \
  --wasm $PAIR_WASM \
  --id $PAIR_ID \
  -- \
  swap \
  --to "$USER_ADDRESS" \
  --out 49 \
  --in_max 100 


echo Now the user should have:
echo 803 units of TOKEN_A
echo "Check user\'s TOKEN_A balance"
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_A_ID \
  -- \
  balance \
  --id $USER_ADDRESS

echo 949 units of TOKEN_B
echo "Check user\'s TOKEN_B balance"
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_B_ID \
  -- \
  balance \
  --id $USER_ADDRESS

echo And the Pair contract should hold:
PAIR_CONTRACT_ADDRESS="{\"address\": {\"contract\":\"$PAIR_ID\"}}"

echo 197 tokens of TOKEN_A
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_A_ID \
  -- \
  balance \
  --id "$PAIR_CONTRACT_ADDRESS"

echo 51 tokens of TOKEN_B
soroban contract invoke \
  $ARGS \
  --wasm $PAIR_WASM\
  --id $TOKEN_B_ID \
  -- \
  balance \
  --id "$PAIR_CONTRACT_ADDRESS"
```

### 7.- The final part: Withdraw
The final test is when the user want's to exit the liquidity pool and withdraw its tokens by giving back the pair_tokens that it has:

The function here will be
```rust
fn withdraw(    e: Env,
                to: Address,
                share_amount: i128, 
                min_a: i128, 
                min_b: i128) -> (i128, i128)
```



```bash

soroban contract invoke \
  $ARGS_USER \
  --wasm $PAIR_WASM \
  --id $PAIR_ID \
  -- \
  withdraw \
  --to "$USER_ADDRESS" \
  --share_amount 100 \
  --min_a 197 \
  --min_b 51 
```

If you want to continue experimenting directly with the CLI, here aresome env variable setting that might be useful <3

```bash
ARGS="--network standalone --source token-admin"
PAIR_WASM="pair/target/wasm32-unknown-unknown/release/soroswap_pair_contract.wasm"
PAIR_ID=$(cat .soroban/pair_wasm_hash)
TOKEN_ADMIN_ADDRESS=$(cat .soroban/token_admin_address)
USER_ADDRESS=$(cat .soroban/user_address)
TOKEN_A_ID=$(cat .soroban/token_a_id)
TOKEN_B_ID=$(cat .soroban/token_b_id)
ARGS_USER="--network standalone --source user"


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

___
In the next, we will experiment the creation of Pair contracts through the SoroswapFactory contract!


