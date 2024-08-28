# SoroswapPair

The SoroswapPair Contract implements the token interface (hence, it has the same functions that any Stellar Asset Contract) and it also has the specific functions for a liquidity pool to exist.\
\
Check the code here: [https://github.com/soroswap/core/tree/main/contracts/pair](https://github.com/soroswap/core/tree/main/contracts/pair)

Here is the contract interface:

```rust
pub trait SoroswapPairTrait{
    /// Initializes a new Soroswap pair by setting token addresses, factory, and initial reserves.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    /// * `factory` - The address of the Soroswap factory contract.
    /// * `token_0` - The address of the first token in the pair.
    /// * `token_1` - The address of the second token in the pair.
    fn initialize(e: Env, factory: Address, token_0: Address, token_1: Address)-> Result<(), SoroswapPairError>;

    /// Deposits tokens into the Soroswap pair and mints LP tokens in return.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    /// * `to` - The address where the minted LP tokens will be sent.
    ///
    /// # Returns
    /// The amount of minted LP tokens.
    /// Possible errors:
    /// - `SoroswapPairError::NotInitialized`: The Soroswap pair has not been initialized.
    /// - `SoroswapPairError::DepositInsufficientAmountToken0`: Insufficient amount of token 0 sent.
    /// - `SoroswapPairError::DepositInsufficientAmountToken1`: Insufficient amount of token 1 sent.
    /// - `SoroswapPairError::DepositInsufficientFirstLiquidity`: Insufficient first liquidity minted.
    /// - `SoroswapPairError::DepositInsufficientLiquidityMinted`: Insufficient liquidity minted.
    /// - `SoroswapPairError::UpdateOverflow`: Overflow occurred during update.
    fn deposit(e:Env, to: Address)  -> Result<i128, SoroswapPairError>;

    /// Executes a token swap within the Soroswap pair.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    /// * `amount_0_out` - The desired amount of the first token to receive.
    /// * `amount_1_out` - The desired amount of the second token to receive.
    /// * `to` - The address where the swapped tokens will be sent.
    ////// # Errors
    /// Returns an error if the swap cannot be executed. Possible errors include:
    /// - `SoroswapPairError::NotInitialized`
    /// - `SoroswapPairError::SwapInsufficientOutputAmount`
    /// - `SoroswapPairError::SwapNegativesOutNotSupported`
    /// - `SoroswapPairError::SwapInsufficientLiquidity`
    /// - `SoroswapPairError::SwapInvalidTo`
    /// - `SoroswapPairError::SwapInsufficientInputAmount`
    /// - `SoroswapPairError::SwapNegativesInNotSupported`
    /// - `SoroswapPairError::SwapKConstantNotMet`: If the K constant condition is not met after the swap.
    fn swap(e: Env, amount_0_out: i128, amount_1_out: i128, to: Address) -> Result<(), SoroswapPairError>;

    /// Withdraws liquidity from the Soroswap pair, burning LP tokens and returning the corresponding tokens to the user.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    /// * `to` - The address where the withdrawn tokens will be sent.
    ///
    /// # Returns
    /// A tuple containing the amounts of token 0 and token 1 withdrawn from the pair.
    fn withdraw(e: Env, to: Address) -> Result<(i128, i128), SoroswapPairError>;

    /// Skims excess tokens from reserves and sends them to the specified address.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    /// * `to` - The address where the excess tokens will be sent.
    fn skim(e: Env, to: Address);

    /// Forces reserves to match current balances.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    fn sync(e: Env);

    /// Returns the address of the first token in the Soroswap pair.
    fn token_0(e: Env) -> Address;
    
    /// Returns the address of the second token in the Soroswap pair.
    fn token_1(e: Env) -> Address;
    
    /// Returns the address of the Soroswap factory contract.
    fn factory(e: Env) -> Address;

    /// Returns the value of the last product of reserves (`K`) stored in the contract.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    ///
    /// # Returns
    /// The value of the last product of reserves (`K`).
    fn k_last(e: Env) -> i128;

    /// Returns the current reserves and the last block timestamp.
    ///
    /// # Arguments
    /// * `e` - The runtime environment.
    ///
    /// # Returns
    /// A tuple containing the reserves of token 0 and token 1.
    fn get_reserves(e: Env) -> (i128, i128);

}


#[contract]
pub struct SoroswapPairToken;

#[contractimpl]
impl SoroswapPairToken {

    pub fn total_supply(e: Env) -> i128;
}

#[contractimpl]
impl token::Interface for SoroswapPairToken {

    fn allowance(e: Env, from: Address, spender: Address) -> i128;

    fn approve(e: Env, from: Address, spender: Address, amount: i128, expiration_ledger: u32)
    
    fn balance(e: Env, id: Address) -> i128;

    fn transfer(e: Env, from: Address, to: Address, amount: i128);

    fn transfer_from(e: Env, spender: Address, from: Address, to: Address, amount: i128);

    fn burn(e: Env, from: Address, amount: i128);

    fn burn_from(e: Env, spender: Address, from: Address, amount: i128);

    fn decimals(e: Env) -> u32;

    fn name(e: Env) -> Bytes;

    fn symbol(e: Env) -> Bytes;
}

```
