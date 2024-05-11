# Cross contract calls

En esta guia abordaremos como llamar a contratos de soroswap desde un contrato personalizado:

## Instalar e importar dependencias:

1. En nuestro archivo Cargo.toml importamos soroban-sdk, para esta guia utilizaremos la version `"20.5.0"`.

```
[dependencies]
  soroban-sdk = { version = "20.5.0" }
```