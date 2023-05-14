# The SoroswapFactory contract
Creates one Liquidity Pool Token smart contract per unique token pair.

```rust

pub trait SoroswapFactoryTrait{
    // Sets the fee_to_setter address and sets the pair_wasm_hash to create new pair contracts
    fn initialize(e: Env, setter: Address, pair_wasm_hash: BytesN<32>);

    /*  *** Read only functions: *** */

    // feeTo is the recipient of the charge.
    // function feeTo() external view returns (address);
    fn fee_to(e: Env) -> BytesN<32>;

    // The address allowed to change feeTo.
    // function feeToSetter() external view returns (address);
    fn fee_to_setter(e: Env) -> Address;

    // Returns the total number of pairs created through the factory so far.
    // function allPairsLength() external view returns (uint);  
    fn all_pairs_length(e: Env) -> u32;

    // Returns the address of the pair for token_a and token_b, if it has been created, else address(0) 
    // function getPair(address token_a, address token_b) external view returns (address pair);
    fn get_pair(e: Env, token_a: BytesN<32>, token_b: BytesN<32>) -> BytesN<32> ;

    // Returns the address of the nth pair (0-indexed) created through the factory, or address(0) if not enough pairs have been created yet.
    // function allPairs(uint) external view returns (address pair);
    fn all_pairs(e: Env, n: u32) -> BytesN<32>;

    // Returns a bool if a pair exists;
    fn pair_exists(e: Env, token_a: BytesN<32>, token_b: BytesN<32>) -> bool;

    /*  *** State-Changing Functions: *** */

    // function setFeeTo(address) external;
    fn set_fee_to(e: Env, to: BytesN<32>);

    // function setFeeToSetter(address) external;
    fn set_fee_to_setter(e: Env, new_setter: Address);
    
    //Creates a pair for token_a and token_b if one doesn't exist already.
    // function createPair(address token_a, address token_b) external returns (address pair);
    fn create_pair(e: Env, token_a: BytesN<32>, token_b: BytesN<32>) -> BytesN<32>;
}

```