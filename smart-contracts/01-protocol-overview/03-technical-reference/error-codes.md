# Error Codes

Error Codes in the Soroswap AMM Smart Contractws are organized by Contrract

**SoroswapPair** returns errors in **100s**

**SoroswapFactory** returns errors in **200s**

**SorowsapRouter** returns errors in **500s**

```rust

pub enum SoroswapPairError {
    /// SoroswapPair: already initialized
    InitializeAlreadyInitialized = 101,
    /// SoroswapPair: not yet initialized
    NotInitialized = 102,

    /// SoroswapPair: token_0 must be less than token_1 while initializing
    InitializeTokenOrderInvalid = 103,

    /// SoroswapPair: insufficient amount of token 0 sent while doing deposit
    DepositInsufficientAmountToken0 = 104,
    /// SoroswapPair: insufficient amount of token 1 sent while doing deposit
    DepositInsufficientAmountToken1 = 105,
    /// SoroswapPair: insufficient first liquidity minted while doing deposit
    DepositInsufficientFirstLiquidity = 106,
    /// SoroswapPair: insufficient liquidity minted while doing deposit
    DepositInsufficientLiquidityMinted = 107,
    /// SoroswapPair: insufficient output amount while doing deposDepositit

    SwapInsufficientOutputAmount = 108,
    /// SoroswapPair: negatives amounts out dont supported while doing swap
    SwapNegativesOutNotSupported = 109,
    /// SoroswapPair: insufficient liquidity to do the swap
    SwapInsufficientLiquidity = 110,
    /// SoroswapPair: invalid to to do the swap
    SwapInvalidTo = 111,
    /// SoroswapPair: insufficient input amount while doing swap
    SwapInsufficientInputAmount = 112,
    /// SoroswapPair: negatives amounts in dont supported while doing swap
    SwapNegativesInNotSupported = 113,
    /// SoroswapPair: K constant is not met while doing swap
    SwapKConstantNotMet = 114,

    /// SoroswapPair: liquidity was not initialized yet while doing withdraw
    WithdrawLiquidityNotInitialized = 115,
    /// SoroswapPair: insufficient sent shares while doing withdraw
    WithdrawInsufficientSentShares = 116,
    /// SoroswapPair: insufficient liquidity burned while doing withdraw
    WithdrawInsufficientLiquidityBurned = 117,

    /// SoroswapPair: OVERFLOW while updating
    UpdateOverflow = 118,
}

pub enum FactoryError {
    /// SoroswapFactory: not yet initialized
    NotInitialized = 201,

    /// SoroswapFactory: token_a and token_b have identical addresses
    CreatePairIdenticalTokens = 202,
    /// SoroswapFactory: pair already exists between token_a and token_b
    CreatePairAlreadyExists = 203,

    /// SoroswapFactory: already initialized
    InitializeAlreadyInitialized = 204,

    /// SoroswapFactory: pair does not exist
    PairDoesNotExist = 205,

    /// SoroswapFactory: index does not exist
    IndexDoesNotExist = 206,
}

pub enum CombinedRouterError {
    RouterNotInitialized = 501,
    RouterNegativeNotAllowed = 502,
    RouterDeadlineExpired = 503,
    RouterInitializeAlreadyInitialized = 504,
    RouterInsufficientAAmount = 505,
    RouterInsufficientBAmount = 506,
    RouterInsufficientOutputAmount = 507,
    RouterExcessiveInputAmount = 508,
    RouterPairDoesNotExist = 509,

    LibraryInsufficientAmount = 510,
    LibraryInsufficientLiquidity = 511,
    LibraryInsufficientInputAmount = 512,
    LibraryInsufficientOutputAmount = 513,
    LibraryInvalidPath = 514,
    LibrarySortIdenticalTokens = 515,
}
```

