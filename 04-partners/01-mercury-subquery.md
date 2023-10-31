# Collaboration with Mercury and SubQuery

This article outlines the outcomes and walkthroughs of our collaborative projects with Mercury and SubQuery indexers. We aim to achieve two primary objectives:
1. Introduce developers from the Stellar and Soroban ecosystems to the capabilities of indexer services.
2. Assist indexers in refining their offerings by reporting bugs and providing documentation feedback we've uncovered through our usage.

## The Importance of Indexers in Blockchain Ecosystems

Utilizing indexers is crucial for efficient data retrieval, thereby enabling developers to offer a seamless user experience. Although blockchains inherently ensure transactional integrity, extracting an entire history directly from a node is computationally intensive. Therefore, indexers serve as invaluable tools. This article serves two main goals:
- Demonstrate practical uses of the indexer as an example or initial repository.
- Test various indexer solutions, offering constructive feedback on bugs and documentation.

## Mercury: Subscription-Based Indexing Solutions

Mercury offers a subscription-based indexing service equipped with numerous features such as alert systems and code execution environments. As a fully managed service, Mercury obviates the need for developers to manage any GraphQL service themselves.

In our repository, you'll find a Node.js client pre-configured with queries to inspect a specific contract, specified through the repository's environment variables.

### Getting Started with Mercury

**Prerequisites**: Docker installation on your machine

1. Clone the repository: `https://github.com/paltalabs/mercury-client.git`
2. Duplicate `.env.example` as `.env`
3. Request Mercury access [here](https://developers.mercurydata.app/requesting-access)
4. Populate the `MERCURY_ACCESS_TOKEN` in `.env`. For usage exceeding 7 days, also complete `MERCURY_TESTER_EMAIL` and `MERCURY_TESTER_PASSWORD`.
5. Update `CONTRACT_ADDRESS` if you are interested in a contract other than the Soroswap's Factory contract.
6. Run the container (Node 18.8.2): `bash run.sh`
7. Install dependencies: `yarn`
8. Use predefined scripts to interact with the contract:

    ```
    node scripts/subscribeToEntries.js
    node scripts/getAllEntriesForContract.js
    node scripts/getEntrySubscriptions.js
    node scripts/getEventSubscriptions.js
    ```

## SubQuery: Versatile Indexing for Multiple Platforms

SubQuery is a comprehensive indexer that interfaces seamlessly with multiple blockchain platforms, including Stellar and Soroban. We've developed a customized SubQuery project capable of IPFS deployment and management through SubQuery's Managed Service.

However, storing blockchain history requires access to an archive node, which can be a limitation. While several projects are developing Soroban-compatible archive nodes, none are publicly available yet.

### Getting Started with SubQuery

**Requirements**: Docker

Our setup incorporates Docker inside a Node.js image to manage the required Node.js version and to prevent the need for a global `subql` package installation. If you prefer to install node, docker and subql locally you can start from step 4.

1. Run the container: `bash run.sh`
2. Install Docker and SubQuery:

    ```
    bash install_docker.sh
    bash setup_subquery.sh
    ```

3. Navigate to `subql-starter` directory and execute:

    ```
    yarn
    dockerd &
    ```
4. In another terminal 
    ```
    bash connect.sh
    ```
    and (if you prefer to install node, docker and subql locally you can start from here)
    ```
    cd subql-starter
    yarn codegen
    yarn build
    yarn start:docker
    ```

5. Begin querying by navigating to `http://localhost:3000/graphql`

6. To publish your project to IPFS, run:

    ```
    cd subql-starter
    subql publish
    ```

### Conclusion

We've demonstrated how to leverage both Mercury and SubQuery indexers, reporting bugs and providing documentation feedback along the way. Each service offers unique approaches to solving data availability issues. While SubQuery provides a more mature and UI-rich solution, its requirement for an archive node adds complexity. Mercury, however, simplifies the process by only requiring subscriptions and queries, thereby eliminating the need to manage additional infrastructure.