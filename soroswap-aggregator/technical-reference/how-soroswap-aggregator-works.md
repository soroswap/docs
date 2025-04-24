# How Soroswap Aggregator works

The **Soroswap Aggregator** is a smart contract that enables users to swap assets across multiple protocols simultaneously, optimizing returns. Built on the [Soroban](https://developers.stellar.org) platform within the Stellar network, it allows users to split trades between different liquidity platforms.

### Aggregator Architecture

* **Aggregator Contract**: The core of the system, responsible for managing swap requests. It uses a mechanism called **`DexDistribution`** to calculate the best way to split the trade among different DEXs. This contract handles the coordination between different protocols and ensures that swaps are executed efficiently.
* **Adapters**: Each integrated DEX has a dedicated adapter, which acts as a bridge between the Aggregator and the specific DEX. These adapters manage the details of how the Aggregator interacts with each protocol, ensuring seamless communication.
* **Deployer Contract**: To ensure security, the deployment and initialization of adapters are handled by a dedicated Deployer Contract. This contract automates the process, reducing the risk of errors and preventing the integration of insecure adapters.

### How the DexDistribution is Calculated

The **`DexDistribution`** mechanism is crucial for optimizing swaps across different DEXs. The [**Soroswap.Finance Aggregator** ](https://github.com/soroswap/aggregator/blob/main/audits/2024-08-31_Soroswap_Aggregator_Audit_Summary_by_RuntimeVerification.pdf)utilizes a [**Zephyr Indexer** ](https://github.com/soroswap/phoenix-zephyr-indexer)table for each underlying protocol. This indexer collects data on liquidity and rates available across various DEXs. Using this information, the [**Soroswap Router SDK**](https://docs.soroswap.finance/soroswap-router-sdk) calculates the optimal distribution of the swap across the supported protocols, ensuring that the swap is divided in the most efficient way possible, maximizing returns and minimizing costs.\
For more details on [The Importance of Indexers in Blockchain Ecosystems](https://docs.soroswap.finance/04-partners/01-mercury-subquery#the-importance-of-indexers-in-blockchain-ecosystems)

### Operational Flow

**Deployment and Initialization**: When the Aggregator is deployed, the administrator initializes the contract and registers the supported DEX protocols. The Deployer Contract ensures that only properly configured adapters are integrated into the system.

<figure><img src="../../.gitbook/assets/Captura de pantalla 2024-09-06 a las 10.38.26.png" alt=""><figcaption><p><strong>Aggregator Initialization Diagram</strong>.</p></figcaption></figure>

**Swap Requests**: Whenever a user initiates a swap, the [**Soroswap Router SDK** ](https://docs.soroswap.finance/soroswap-router-sdk)calculates the optimal way to distribute the swap using **`DexDistribution`**`.` This process is illustrated in **Figure: Aggregator Function Diagram** and involves:

* **Protocols used for the swap**: Selecting the best DEXs for the transaction.
* **Fractions of the total amount to be swapped**: Determining how much of the swap will be executed on each DEX.
* **Path of the swap**: Defining the sequence of tokens from the input to the output.

<figure><img src="../../.gitbook/assets/Captura de pantalla 2024-09-06 a las 10.42.11.png" alt=""><figcaption><p><strong>Aggregator Function Diagram</strong></p></figcaption></figure>

**Error Handling and Validation**: The system includes validation steps to ensure that swap paths are correctly formed and that the transactions adhere to the defined rules. If any issues are detected, the transaction is rejected to protect the user’s funds.

{% hint style="warning" %}
**Prevention of Malicious Code**: Use the [**Deployer Contract**](https://developers.stellar.org/docs/build/smart-contracts/example-contracts/deployer) to add adapters to the Aggregator. This ensures that only trusted and properly initialized adapters are integrated, minimizing the risk of malicious code.
{% endhint %}

**Route Validation**: Follow the **Strict Rules** for validating swap routes, as shown in **Figure: Aggregator Function Diagram**. This will prevent the use of malformed paths that could lead to failed transactions or losses.

{% hint style="info" %}
**Documentation and User Education**: Read the **Clear Documentation** and engage in **User Education** to understand how to interact safely with the [Aggregator.](https://github.com/soroswap/aggregator/blob/main/audits/2024-08-31_Soroswap_Aggregator_Audit_Summary_by_RuntimeVerification.pdf) Be aware of the risks associated with swaps and follow best practices for using the platform securely.
{% endhint %}

**Optimization of Validations**: Take advantage of **Validation Optimization** at the adapter level to reduce costs and avoid redundant checks. This ensures that only necessary checks are performed, improving overall system efficiency.

### Conclusion

The **Soroswap.Finance Aggregator** is designed to enhance the user experience by ensuring efficient and secure token swaps across multiple DEXs. Through careful coordination and validation, the Aggregator maximizes returns and minimizes risks. For more detailed technical information, users can refer to the audit reports and documentation linked below:

* [Security Audit Report](https://github.com/soroswap/aggregator/blob/main/audits/2024-08-31_Soroswap_Aggregator_Audit_by_RuntimeVerification.pdf)
* [Security Audit Findings Summary](https://github.com/soroswap/aggregator/blob/main/audits/2024-08-31_Soroswap_Aggregator_Audit_Summary_by_RuntimeVerification.pdf)
