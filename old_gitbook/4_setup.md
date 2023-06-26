# Setup your environment.
In order to experiment with this contracts, you'll need to

1.- Clone the SoroswapFinance `core` repo:
```bash
git clone https://github.com/soroswap/core
```


2.- Run the `quickstart.sh` script
```bash
cd core
bash quickstart.sh standalone
```

This script will create the `soroban-network` Docker network, and will open two Docker containers:
(a) A Stellar Quickstart container that will be used to run a local standalone soroban blockchain.
(b) A Soroban-Preview docker container. Currently in PREVIEW-9

This last container is important for developers that might be developing different projects with different SDK versions. Currently, Soroswap.Finance is supporting PREVIEW-9, so the Docker image to be used will be:

- `stellar/quickstart:soroban-dev@sha256:a057ec6f06c6702c005693f8265ed1261e901b153a754e97cf18b0962257e872`
- `esteblock/soroban-preview:9`

3.- Enter to the `soroban-preview-9` docker container in order to run scripts inside:
```bash
docker exec -it soroban-preview-9 bash
```

Also, if you don't want to copy or write this line all the time, you can just run the `run.sh` script

```bash
bash run.sh
```

As this is optional, this is important to be able to interact with the protocol using the correct soroban CLI version. 

Once you are inside the `soroban-preview-9` container, you are ready to experiment with the `SoroswapPair` or the `SoroswapFactory` contract!
