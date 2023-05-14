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


