### Disclaimer: Potential Risks of Protocol and Token Upgrades

The Aggregator protocol interacts with various subcontracts through Adapter contracts and directly with exchange protocols. It is important to note that some of these protocols may upgrade their WebAssembly (WASM) code. While upgrades can bring new features and improvements, they also pose potential risks, including the introduction of malicious code. Similarly, tokens themselves can be upgraded or may contain malicious code, especially when dealing with unknown or unverified assets.

#### Risk Description:
When using the Aggregator, transactions transitively call multiple subcontracts. If the signature of a transaction passes the `require_auth` checks at each level, the called contracts can fully manipulate the signer's funds. This means that if a protocol the Aggregator accesses or a token being traded is upgraded to malicious code, there is a risk that a transaction could lead to the loss of some or all of the signer's funds, even if it passes the minimum or maximum checks on dynamic assets (e.g., `swap_exact_tokens_for_tokens`).

#### User Guidance:
- **Inspect Contracts and Tokens:** Users should carefully inspect and understand the footprint and authorization payloads of each contract call within a transaction, as well as the nature and history of the tokens being traded.
- **Understand the Risk:** We acknowledge that not every user may have the technical knowledge to discern when a transaction might have malicious effects. Therefore, we recommend users educate themselves on the potential risks involved with protocol upgrades, subcontract calls, and token interactions.
- **Educational Resources:** For more information on understanding contract interactions, token risks, and the dangers associated with protocol and token upgrades, please refer to the following [resources](https://developers.stellar.org/docs/build/smart-contracts/example-contracts/auth#require_auth).

By using the Aggregator, you acknowledge the potential risks associated with subcontract calls, protocol upgrades, and token interactions. Please use this service responsibly and remain vigilant when interacting with any smart contracts and tokens.