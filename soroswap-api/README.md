# Soroswap API

A robust REST API built with NestJS that serves as the backend infrastructure for the Soroswap DEX (Decentralized Exchange) on the Stellar Network. The API provides essential services for:

- **Authentication & Authorization**: Secure JWT-based authentication system with role-based access control
- **Trading Operations**:
  - Swap routing and execution
  - Price discovery and quotes
  - Multi-protocol support (Soroswap, Phoenix, etc.)
- **Asset Management**:
  - Comprehensive asset listing
  - Pair information and liquidity data
  - Token price tracking
- **Network Integration**:
  - Support for both Mainnet and Testnet
  - Direct interaction with Stellar Soroban smart contracts
  - Transaction building and submission

The API is fully documented with Swagger/OpenAPI, available at [Soroswap API docs](https://api.soroswap.finance/docs) endpoint, and includes built-in request logging, monitoring, and health check capabilities.

## Key Features

- RESTful architecture with NestJS framework
- PostgreSQL database integration via Prisma ORM
- Comprehensive JWT authentication
- Role-based access control (RBAC)
- Swagger API documentation
- Docker containerization support
- Request logging and monitoring
- Health check system
