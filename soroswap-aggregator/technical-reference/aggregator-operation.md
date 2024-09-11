# Aggregator Operation

### **Aggregator Initialization**

When the [Aggregator](https://github.com/soroswap/aggregator/) contract is deployed, the user who initializes it becomes the protocol administrator. During initialization, compatible underlying protocols are registered in the contract's storage, as shown in Figure 1.

<figure><img src="../../.gitbook/assets/Captura de pantalla 2024-09-05 a las 11.37.59.png" alt=""><figcaption><p><strong>Figure 1: Aggregator <code>initialize</code> function operations diagram.</strong></p></figcaption></figure>

### **Token Swap Process**

The Aggregator facilitates token swaps through two primary functions:

* **`swap_exact_tokens_for_tokens (when you want to have an exact input)`**
* **`swap_tokens_for_exact_tokens (when you want ot have an exact output)`**

These functions require users to specify:

* The input token (`token_in`).
* The output token (`token_out`).
* The amounts involved.
* A distribution vector (`DexDistribution`).

This vector contains information on how the swap should be split across different protocols and the paths to be followed for the operation.

<figure><img src="../../.gitbook/assets/Captura de pantalla 2024-09-05 a las 11.22.43.png" alt=""><figcaption><p>Figure 2: Aggregator <code>swap</code> functions operations diagram.</p></figcaption></figure>

### **Distribution Calculation**

To calculate the amounts to be swapped in each protocol, the **`calculate_distribution_amounts`** function is used. The mathematical formula applied is:

$$
\text{amount}_i = \left\lfloor \frac{\text{total\_amount} \times \text{dist}_i.\text{parts}}{\text{total\_parts}} \right\rfloor ; \quad \forall i \in Z \text{ s.t. } 1 \leq i < n
$$

This formula calculates the amount to be swapped for each protocol (i), where:

* `total_amount` is the total amount to be swapped.
* `total_parts` is the sum of all parts specified in `DexDistribution`.

$$
(\text{dist}_i.\text{parts})  is  the fraction  assigned  to  protocol  (i).
$$

$$
(Z)  represents   the  set  of  integers, and  (1 \leq i < n)  specifies
$$

$$
that  (i)   is  within  the  range  of  protocols  involved  in  the  swap.
$$

This formula ensures that the total amount to be swapped is correctly distributed among the selected protocols.

### **Administrative Functions**

The Aggregator includes administrative functions that allow management of the contract, such as:

* Initializing the contract.
* Registering, pausing, and removing protocols.
* Modifying the administrator address.

These functions ensure that the administrator has control over the protocols used in swaps and that only trusted protocols are utilized.

### **Adapter Interface and Protocols**

The Aggregator communicates with protocols via adapters, which implement the **`SoroswapAggregatorAdapterTrait`** interface. This interface defines standard functions such as:

* **`initialize`**: Sets up the adapter with necessary information.
* **`swap_exact_tokens_for_tokens`**: Executes swaps specifying the minimum token amounts.
* **`swap_tokens_for_exact_tokens`**: Executes swaps specifying the maximum input tokens.

Each adapter handles the specifics of its respective protocol, as shown in **Figure 3**.

<figure><img src="../../.gitbook/assets/Captura de pantalla 2024-09-05 a las 12.02.52.png" alt=""><figcaption><p><strong>Figure 3: Adapter swap functions and data fetchers diagram.</strong></p></figcaption></figure>

