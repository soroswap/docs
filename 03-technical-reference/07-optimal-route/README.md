# Technical Architecture for Optimal Routing

This document explain how Soroswap will find the optimal route for a swap

## Background

We explored 3 protocols: Uniswap, PancakeSwap and 1Inch

### Uniswap & PancakeSwap

How it works:
Uniswap and PancakeSwap work in a similar way: In the frontend they use an sdk to get the best route.

The algorithm to get the best route is the following:

1. Get all the pools: they ask to subgraph for the available pools ([see here](https://github.com/Uniswap/smart-order-router/blob/9dda6a965e7f5c0e48efa8214363a660ed034350/src/providers/v2/subgraph-provider.ts#L78)).
2. Computes all routes given a maxHops (see [computeAllRoutes](https://github.com/Uniswap/smart-order-router/blob/9dda6a965e7f5c0e48efa8214363a660ed034350/src/routers/alpha-router/functions/compute-all-routes.ts#L67)). MaxHops is the maximum number of pools that the route can have.
3. splits the route ([see here](https://github.com/Uniswap/smart-order-router/blob/main/src/routers/alpha-router/functions/best-swap-route.ts#L146))
   1. They define a minimum percentage for a split and make an array of 100% divided by the minimum percentage: for example is minimum percentage is 5% then the array will be [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
4. They get a quote for every split
5. They validate all routes with quotes
6. Then choose the best quote (minimum amountIn or maximum amountOut)

They also keep routes on cache

### 1Inch

They call an API called Pathfinder to get the best route across multiple protocols. However, the API is not open source and we don't know how it works.

## Soroswap Optimal Routing

Here we name each of the parts of Soroswap and the responsibility they will have in the optimal route

![](images/draw.png)

### Soroswap-router-sdk

##### What will do ?

This will manage all the logic of the optimal route swap.

##### What we need ?

We need to create a class with all the methods and logic for the optimal route swap and connect it with the backend to get the necessary data for the algorithm.
This will get all the pools from the backend and then will compute the best route. It will use a similar algorithm as Uniswap and PancakeSwap.

### Frontend

##### What will do ?

The frontend will call directly the @soroswap-router-sdk methods to implement it

##### What we need ?

We don't need anything special here more than implement the @soroswap-router-sdk in the frontend

### Backend

##### What will do ?

Will call the necessary data from @mercury-sdk to send to the @soroswap-router-sdk

##### What we need?

We need endpoints to get the pools with reserves from mercury-sdk filter by (token0, token1)

### Mercury-sdk

The difference Mercury and subgraph is that Mercury give us the data we need in XDR. We just need to add a method to parse the data to use it in the @soroswap-router-sdk

##### What will do ?

Will manage the methods to get the pools and necessary data for the algorithm in @soroswap-router-sdk

##### What we need ?

We need query and methods to get the pools from mercury and then parse the data to use this in the backend

## Soroswap Aggregator

Same but using pools from other protocols. We will need to create subscription methods to get the pools from other protocols and then use the same logic as Soroswap
