# Using Soroswap in TypeScript

The Soroswap protocol allows you to interact with Stellar's smart contract platform: Soroban. In this section, we will explore how to write TypeScript scripts to use the contracts in our own automations or applications:

### Prerequisites:

Before starting, it is necessary to clarify that to understand what we are doing here, you need to have a good understanding of TypeScript, smart contracts, and how a blockchain works. In addition, you need to know how to use [stellar-sdk](https://stellar.github.io/js-stellar-sdk/#usage) since we will use its [TransactionBuilder](https://stellar.github.io/js-stellar-sdk/TransactionBuilder.html) class to create operations, simulate, sign, and send transactions. Additionally, some types and functions for transforming values.

>[!Tip]
If you need practical examples of how to create a transaction builder or how to use the SDK in general, you can guide yourself from our projects [soroswap/core](https://github.com/soroswap/core/tree/main/scripts) and [paltalabs/mercury-client.](https://github.com/paltalabs/mercury-client)

## Build, sign & send:

>[!Warning]
For educational purposes, we will use an adaptation of the TransactionBuilder used in the [soroswap/core](https://github.com/soroswap/core/) repository. The code will need adjustments depending on your project and work methodology, so we recommend always working hand-in-hand with the official Stellar SDK [Documentation](https://stellar.github.io/js-stellar-sdk/#usage) to be able to build one tailored to your needs.

#### Installing Stellar SDK

In this guide, we will be using the ` ^11.2.2 `  version of Stellar SDK, available through npm or yarn as["@stellar/stellar-sdk"](https://www.npmjs.com/package/@stellar/stellar-sdk).
To do this, we will install it as follows:

```bash
npm i soroswap-router-sdk@11.2.2
```

or

```bash
yarn add soroswap-router-sdk@11.2.2
```

### Building the transaction:

In order to execute our operations on the blockchain, we will first need to create a transaction to send ([Forward](#methods) in this guide you will find the available methods and their predefined parameters):

First, we must create an instance of the router contract using the Contract class, giving as an argument the Address of the contract and using its call method, we create the operation delivering as arguments the method of the operation (for example: "swap_exact_assets_for_assets") and the parameters defined to then create the transaction with our TransactionBuilder:

> [!Tip]
>If you need to thoroughly review all the methods available in the router contract or simply want to know how the contract works, you can review it directly [here](https://github.com/soroswap/core/blob/febe01d8bbd9677a902863925efcc509129b0306/contracts/router/src/lib.rs) in the official repository of Soroswap.

> [!Tip]
>To obtain the routerAddress respective to the network on which you want to operate, you can make a direct call to the Soroswap api in the following way: 
> ```curl
>curl -XGET -H "Content-type: application/json" 'https://api.soroswap.finance/api/${network}/router'
>```

```typescript
const horizonServer = stellarSDK.Horizon.Server("horizon-rpc url");
const createTx = async (account: Keypair, routerAddress: Address, method: String) => {
  const createTxBuilder = async (account: Keypair): Promise<TransactionBuilder> => {
      try {
        const account: Account = await horizonServer.getAccount(account.publicKey());
        return new TransactionBuilder(account, {
          fee: stellarSdk.BASE_FEE,
          timebounds: { minTime: 0, maxTime: 0 },
          networkPassphrase: NETWORK.PASSPHRASE,
        });
      } catch (e: any) {
        console.error(e);
        throw Error("unable to create txBuilder");
      }
    }
    const contractInstance = new Contract(routerAddress);
    const contractOperation = contractInstance.call( method, ...params );
    const txBuilder = await createTxBuilder(account);
    txBuilder.addOperation(contractOperation);
    const tx = txBuilder.build();
  return tx;
}
```
### Simulate, sign & send the transaction:
Once you have created the transaction, we must deliver it as an argument to our function to invoke transactions together with the keypair of the account with which we are going to operate. This function will be responsible for simulating the transaction (to verify the validity of this same one) and if everything is correct, we will proceed to assemble, sign and send the transaction:

```typescript
const horizonServer = stellarSDK.Horizon.Server("horizon-rpc url");
const invokeTransaction = async (tx: Transaction, source: Keypair) => {
  const simulatedTx = await server.simulateTransaction(tx);
  //If you only want to review the transaction, you can return the simulatedTx object to explore it in detail.
  // return simulatedTx;
  const txResources = simulatedTx.transactionData.build().resources();
  simulatedTx.minResourceFee = (Number(simulatedTx.minResourceFee) + 10000000).toString();
  const sim_tx_data = simulatedTx.transactionData
    .setResources(
      txResources.instructions() == 0 ? 0 : txResources.instructions() + 500000,
      txResources.readBytes(),
      txResources.writeBytes()
    )
    .build();
  const assemble_tx = SorobanRpc.assembleTransaction(tx, simulatedTx);
  sim_tx_data.resourceFee(
    xdr.Int64.fromString((Number(sim_tx_data.resourceFee().toString()) + 100000).toString())
  );
  const prepped_tx = assemble_tx.setSorobanData(sim_tx_data).build();
  prepped_tx.sign(source);
  const tx_hash = prepped_tx.hash().toString("hex");

  console.log("submitting tx...");
  let response: txResponse = await horizonServer.sendTransaction(prepped_tx);
  let status: txStatus = response.status;
  console.log(`Hash: ${tx_hash}`);
  // Poll this until the status is not "NOT_FOUND"
  while (status === "PENDING" || status === "NOT_FOUND") {
    // See if the transaction is complete
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("checking tx...");
    response = await horizonServer.getTransaction(tx_hash);
    status = response.status;
  }
  return response;
}
```
After calling this function, we can inspect the `response` object to verify that everything went as expected.

## Methods:

> [!Note] 
>The operations available in the router contract that we will review in this documentation are:
> - [Add_liquidity](#add-liquidity-to-a-pool): "add_liquidity"
> - [Remove_liquidity](#remove-liquidity-from-a-pool): "remove_liquidity"
> - [Swap](#swap): "swap_exact_assets_for_assets"

### Add liquidity to a pool:

> [!Note]
> `method: "add_liquidity"`

To add liquidity to a Soroswap pool (or deposit funds), we will need to define the following parameters:

```typescript
asset_a: Address;
asset_b: Address;
amount_a_desired: Number | BigNumber;
amount_b_desired: Number | BigNumber;
amount_a_min: Number | BigNumber;
amount_b_min: Number | BigNumber;
account: Address;
getCurrentTimePlusOneHour: Number;
```
- [asset_a, asset_b]: These are the respective addresses of the asset pair to which we want to add liquidity.
- [amount_a_desired, amount_b_desired]: These are the liquidity amounts you want to add to the respective assets.
- [amount_a_min, amount_b_min]: These are the minimum amounts required to add to each asset, respectively.
- account: This is the address where the tokens will be sent.
- getCurrentTimePlusOneHour: This is the maximum date by which the transaction can be executed.

> [!Note]
All of these values must be converted to [ScVal](https://gist.github.com/Smephite/09b40e842ef454effe4693e0d18246d7#scval-low-level-description) as shown below.

```typescript

const addLiquidityParams: xdr.ScVal[] = [
  new Address(asset_a.contract).toScVal(),
  new Address(asset_a.contract).toScVal(),
  nativeToScVal(amount_a_desired, { type: "i128" }),
  nativeToScVal(amount_b_desired, { type: "i128" }),
  nativeToScVal(amount_a_min, { type: "i128" }),
  nativeToScVal(amount_b_min, { type: "i128" }),
  new Address(account.publicKey()).toScVal(),
  nativeToScVal(getCurrentTimePlusOneHour(), { type: "u64" }),
];
```

### Remove liquidity from a pool:

> [!Note]
> `method: "remove_liquidity"`

To remove liquidity from a Soroswap pool (or withdraw funds), we will need to define the following parameters: 

```typescript
asset_a: Address;
asset_b: Address;
liquidity: Number | BigNumber;
amount_a_min: Number | BigNumber;
amount_b_min: Number | BigNumber;
account: Address;
getCurrentTimePlusOneHour: Number;

```
- [asset_a, asset_b]: These are the respective addresses of the asset pair from which we want to remove liquidity.
- Liquidity: This represents the desired amount of assets to remove from the liquidity pool.
- [amount_a_min, amount_b_min]: These are the minimum amounts required to receive from each asset, respectively.
- account: This is the address where the tokens will be sent.
- getCurrentTimePlusOneHour: This is the maximum date by which the transaction can be executed.

> [!Note]
All of these values must be converted to [ScVal](https://gist.github.com/Smephite/09b40e842ef454effe4693e0d18246d7#scval-low-level-description) as shown below.

```typescript
const removeLiquidityParams: xdr.ScVal[] = [
  new Address(token0.contract).toScVal(),
  new Address(token1.contract).toScVal(),
  nativeToScVal(lpBalance, { type: "i128" }),
  nativeToScVal(0, { type: "i128" }),
  nativeToScVal(0, { type: "i128" }),
  new Address(testAccount.publicKey()).toScVal(),
  nativeToScVal(getCurrentTimePlusOneHour(), { type: "u64" }),
];
```

### Swap:

> [!Note]
> `method: "swap_exact_assets_for_assets"`

To create a Swap operation on Soroswap, we will need to define the following parameters:

```typescript
amount_in: Number | BigNumber;
amount_out_min: Number | BigNumber;
path: Address[];
account: KeyPair;
getCurrentTimePlusOneHour: Number;
```

- amount_in: Represents the desired amount to be exchanged.
- amount_out_min: Represents the minimum acceptable amount to receive for this operation.
- path: Represents the exchange path to follow to obtain the requested asset.
- account: Represents the account where the transaction will be executed.
- getCurrentTimePlusOneHour: Represents the maximum date by which this transaction can be executed.

> [!Note]
All of these values must be converted to [ScVal](https://gist.github.com/Smephite/09b40e842ef454effe4693e0d18246d7#scval-low-level-description) as shown below.

```typescript
const swapParams: xdr.ScVal[] = [
    nativeToScVal(amount_in, { type: "i128" }),
    nativeToScVal(amount_out_min, { type: "i128" }),
    nativeToScVal(path, { type: "Vec" }),
    new Address(account.publicKey()).toScVal(),
    nativeToScVal(getCurrentTimePlusOneHour(), { type: "u64" }),
];
```

## Finding the Most Optimal Path:

It is important to note that: the swap methods in the router will iterate through the path array step by step, performing the indicated exchanges between assets (0 <-> 1, 1 <-> 2, ... n <-> n+1) until the entire route is completed. This is why it is crucial to find the most optimal route to avoid wasting resources on unnecessary transactions.

This is why we at Soroswap have developed [soroswap-router-sdk](https://github.com/soroswap/soroswap-router-sdk), a tool that helps you find the most efficient route for exchanging assets, taking into account the available reserves in Soroswap's liquidity pools.

To utilize this tool, we'll install the ``1.2.4`` version of Soroswap Router SDK into our project. It's available through npm or yarn as ["soroswap-router-sdk"](https://www.npmjs.com/package/soroswap-router-sdk).


```bash
npm i soroswap-router-sdk
```

or

```bash
yarn add soroswap-router-sdk
```

Then, we import it into our project and use it to calculate the optimal path.

```typescript
import {
  Router,
  Token,
  CurrencyAmount,
  TradeType,
  Networks,
} from "soroswap-router-sdk";

const asset0_address = "address0_address";
const asset1_address = "address1_address";

const ASSEET0_TOKEN = new Token(
  Networks.TESTNET,
  asset0_address,
  7, //Number of decimals
  "asset0_symbol",
  "asset0_name"
);

const USDC_TOKEN = new Token(
  Networks.TESTNET,
  asset1_address,
  7, //Number of decimals
  "asset1_symbol",
  "asset1_name"
);

const amount = 10000000; //In stellar Stroops

const router = new Router({
  backendUrl: "https://my-backend.com/", //soroswap backend
  backendApiKey: "my-api-key", // soroswap backend api key
  pairsCacheInSeconds: 20, // pairs cache duration in seconds
  protocols: [Protocols.SOROSWAP], // protocols to be used
  network: Networks.TESTNET, // network to be used
});

const currencyAmount = CurrencyAmount.fromRawAmount(USDC_TOKEN, amount);
const quoteCurrency = ASSEET0_TOKEN;

const route = await router.route(
  currencyAmount,
  quoteCurrency,
  TradeType.EXACT_INPUT
);

console.log(route.trade.path);

//Output: ["0x...", "0x...", "0x..."]

```
This will give us the ``route`` object, which contains an ordered array of addresses representing the most optimal route for the exchange within the ``trade.path`` property.
If you need more information on how to use the Router-sdk or how it works, you can do it directly in the repository of [soroswap/soroswap-router-sdk](https://github.com/soroswap/soroswap-router-sdk)


## Putting it All Together:
Once we have created our methods for interacting with the blockchain and defined the type of operation to be performed along with its parameters, we only need to call the functions to execute our transaction:

for this example we will perform a swap operation on testnet with a random account:

```typescript
const executeSwap = async () => {
  const account = stellarSdk.Keypair.random();
  const routerAddress = axios.get("https://api.soroswap.finance/api/testnet/router");
  const method = "swap_exact_assets_for_assets";
  const amount_in = 2500000; //In stellar stroops
  const amount_out_min = 0; //In stellar stroops
  const path = route.trade.path;
  const swapParams: xdr.ScVal[] = [
      nativeToScVal(amount_in, { type: "i128" }),
      nativeToScVal(amount_out_min, { type: "i128" }),
      nativeToScVal(path, { type: "Vec" }),
      new Address(account.publicKey()).toScVal(),
      nativeToScVal(getCurrentTimePlusOneHour(), { type: "u64" })
  ];
  const tx = await createTx(account, routerAddress, method);
  const res = await invokeTransaction(tx, account);
  console.log(res);
}

executeSwap();
```

