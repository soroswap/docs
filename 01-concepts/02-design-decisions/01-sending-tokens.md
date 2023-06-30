# Design Decisions

The following sections describe some of the notable design decisions made in the Soroswap Protocol. These are safe to skip unless you're interested in gaining a deep technical understanding of how the protocol works under the hood, or writing smart contract integrations!

## Sending Tokens

Typically, smart contracts which need tokens to perform some functionality require would-be interactors to first make an approval on the token contract, then call a function that in turn calls transferFrom on the token contract. This is _not_ how V2 pairs accept tokens. Instead, pairs check their token balances at the _end_ of every interaction. Then, at the beginning of the _next_ interaction, current balances are differenced against the stored values to determine the amount of tokens that were sent by the current interactor. See the [whitepaper](../../whitepaper.pdf) for a justification of why this is the case, but the takeaway is that **tokens must be transferred to the pair before calling any token-requiring method** (the one exception to this rule is [Flash Swaps](../../old\_docusaurus/docs/concepts/core-concepts/flash-swaps/).

## WETH

Unlike Uniswap V1 pools, V2 pairs do not support ETH directly, so ETH⇄ERC-20 pairs must be emulated with WETH. The motivation behind this choice was to remove ETH-specific code in the core, resulting in a leaner codebase. End users can be kept fully ignorant of this implementation detail, however, by simply wrapping/unwrapping ETH in the periphery.

The router fully supports interacting with any WETH pair via ETH.

## Minimum Liquidity

To ameliorate rounding errors and increase the theoretical minimum tick size for liquidity provision, pairs burn the first [MINIMUM\_LIQUIDITY](../../old\_docusaurus/docs/reference/smart-contracts/pair/#minimum\_liquidity) pool tokens. For the vast majority of pairs, this will represent a trivial value. The burning happens automatically during the first liquidity provision, after which point the [totalSupply](../../old\_docusaurus/docs/reference/smart-contracts/pair-erc-20/#totalsupply) is forevermore bounded.
