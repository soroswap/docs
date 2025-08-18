# Soroswap API

The **Soroswap API** is built for developers and teams who want to integrate Soroswap's decentralized infrastucture into their apps. Whether you're building a wallet, a frontend, or another kind of product on Stellar, the API gives you access data from real-time pricing and routing to transaction generation.

## Key features

- 🔁 **Fetch quotes and optimal routes** for token swaps across multiple protocols (Soroswap, Phoenix, Aqua and SDEX)  
- 📊 **Retrieve token and liquidity data**, including pool stats and available trading pairs  
- 🧾 **Build XDR transactions** for on-chain execution
- 🚀 **(Limited-time)** Enable **gasless transactions** via LaunchTube integration  

> 🔗 **Explore the full API reference here**:  
👉 [https://api.soroswap.finance/docs](https://api.soroswap.finance/docs)

## 📚 Documentation & Guides

Choose your learning path:

- 🐶 **New to blockchain/Stellar?** → [`beginner-guide.md`](./beginner-guide.md) - Complete tutorial with explanations
- ⚡ **Experienced developer?** → [`quickstart.md`](./quickstart.md) - Quick integration guide

### API Access
 - **Registration Required**:
    - To use the Soroswap API, you need to register and obtain an API key
    - Visit [api.soroswap.finance/login](https://api.soroswap.finance/register) to get started
    - Registration is free and provides access to the full API functionality
    - Once registered, you can ask for approval to use the API in your applications in our [Discord](https://discord.gg/yuBp6y9u) server

 - **Once registered**, you can access our platform and generate your API key at [api.soroswap.finance/login](https://api.soroswap.finance/login)

**API_URL**: [staging](https://api.soroswap.finance)

📮 **Postman Collection**: 
```json
{
	"info": {
		"_postman_id": "26371c68-9a58-492c-ae81-e63f26b5f66e",
		"name": "Soroswap PUBLIC Collection",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "46319029",
		"_collection_link": "https://solar-zodiac-853470.postman.co/workspace/Soroswap-API~52944326-7526-463e-8890-6cf4e8fb9e43/collection/42435524-26371c68-9a58-492c-ae81-e63f26b5f66e?action=share&source=collection_link&creator=46319029"
	},
	"item": [
		{
			"name": "App",
			"item": [
				{
					"name": "Health",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/health",
							"host": [
								"{{host}}"
							],
							"path": [
								"health"
							]
						}
					},
					"response": []
				},
				{
					"name": "Testnet Tokens",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/api/tokens",
							"host": [
								"{{host}}"
							],
							"path": [
								"api",
								"tokens"
							]
						}
					},
					"response": []
				},
				{
					"name": "Contracts",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/api/mainnet/router",
							"host": [
								"{{host}}"
							],
							"path": [
								"api",
								"mainnet",
								"router"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Auth",
			"item": [
				{
					"name": "Register",
					"request": {
						"auth": {
							"type": "noauth"
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "urlencoded",
							"urlencoded": [
								{
									"key": "username",
									"value": "usertest12",
									"type": "text"
								},
								{
									"key": "password",
									"value": "password",
									"type": "text"
								},
								{
									"key": "email",
									"value": "someexample1@gmail.com",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "{{host}}/register",
							"host": [
								"{{host}}"
							],
							"path": [
								"register"
							]
						}
					},
					"response": []
				},
				{
					"name": "Login",
					"request": {
						"auth": {
							"type": "noauth"
						},
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"email\": \"{{user_email}}\",\n  \"password\": \"{{user_password}}\"\n}\n"
						},
						"url": {
							"raw": "{{host}}/login",
							"host": [
								"{{host}}"
							],
							"path": [
								"login"
							]
						}
					},
					"response": []
				},
				{
					"name": "Refresh",
					"request": {
						"auth": {
							"type": "bearer",
							"bearer": [
								{
									"key": "token",
									"value": "{{refresh_token}}",
									"type": "string"
								}
							]
						},
						"method": "POST",
						"header": [],
						"body": {
							"mode": "urlencoded",
							"urlencoded": []
						},
						"url": {
							"raw": "{{host}}/refresh",
							"host": [
								"{{host}}"
							],
							"path": [
								"refresh"
							]
						}
					},
					"response": []
				},
				{
					"name": "Generate api key",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{host}}/api-keys/generate",
							"host": [
								"{{host}}"
							],
							"path": [
								"api-keys",
								"generate"
							]
						}
					},
					"response": []
				},
				{
					"name": "User Api Key",
					"protocolProfileBehavior": {
						"disableBodyPruning": true
					},
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{host}}/api-keys",
							"host": [
								"{{host}}"
							],
							"path": [
								"api-keys"
							]
						}
					},
					"response": []
				},
				{
					"name": "Revoke Api Key",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json",
								"type": "text"
							}
						],
						"body": {
							"mode": "raw",
							"raw": ""
						},
						"url": {
							"raw": "{{host}}/api-keys/:keyId/revoke",
							"host": [
								"{{host}}"
							],
							"path": [
								"api-keys",
								":keyId",
								"revoke"
							],
							"variable": [
								{
									"key": "keyId",
									"value": ""
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Quote",
			"item": [
				{
					"name": "Protocols",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/protocols?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"protocols"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Quote USDC>CETES w/ gaslessTrustline",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "// Make sure you have set your `host` and `api_key` in Environments\n{\n    \"assetIn\": \"CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\", // USDC\n    \"assetOut\": \"CAL6ER2TI6CTRAY6BFXWNWA7WTYXUXTQCHUBCIBU5O6KM3HJFG6Z6VXV\", // CETES\n    \"amount\": \"1000000000\", // 100.0000000 USDC\n    \"tradeType\": \"EXACT_IN\",\n    \"protocols\": [\"soroswap\", \"phoenix\", \"aqua\", \"sdex\"], \n    \"slippageTolerance\": 50, // Optional\n    \"gaslessTrustline\": true,\n    \"feeBps\": 50\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/quote?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"quote"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Quote USDC>EURC EXACT OUT",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "// Make sure you have set your `host` and `api_key` in Environments\n{\n    \"assetIn\": \"CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\", // USDC\n    \"assetOut\": \"CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV\", // EURC\n    \"amount\": \"1000000000\", // 100.0000000 EURC\n    \"tradeType\": \"EXACT_OUT\",\n    \"protocols\": [\"soroswap\", \"phoenix\", \"aqua\"], \n    \"slippageTolerance\": 50, // Optional\n    \"gaslessTrustline\": false,\n    \"feeBps\": 50\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/quote?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"quote"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Build",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{ // QUOTE. COPY AND PASTE THE RESULT FROM THE \"quote\" endpoint\n    \"quote\": {\n        \"assetIn\": \"CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA\",\n        \"assetOut\": \"CC6RNAVJWE4NRDZH64DLN4WD6PKUMP7DHDMS6SNEX5VHGJJDE57JZ6FU\",\n        \"amountIn\": \"1000000000\",\n        \"amountOut\": \"998638536034\",\n        \"otherAmountThreshold\": \"993597491090\",\n        \"priceImpactPct\": \"2.26\",\n        \"tradeType\": \"EXACT_IN\",\n        \"platform\": \"sdex\",\n        \"rawTrade\": {\n            \"source_asset_type\": \"native\",\n            \"source_amount\": \"99.5000000\",\n            \"destination_asset_type\": \"credit_alphanum4\",\n            \"destination_asset_code\": \"SAT1\",\n            \"destination_asset_issuer\": \"GCNTYYJORSDB3RYWVCNCWK4U5SCCOOZKOXVUQZP6KCVRYLAP6TWWJ3C5\",\n            \"destination_amount\": \"100342.3762435\",\n            \"path\": [],\n            \"min_destination_amount\": \"99840.6643623\",\n            \"trustlineOperation\": {\n                \"source_asset_type\": \"credit_alphanum4\",\n                \"source_asset_code\": \"SAT1\",\n                \"source_asset_issuer\": \"GCNTYYJORSDB3RYWVCNCWK4U5SCCOOZKOXVUQZP6KCVRYLAP6TWWJ3C5\",\n                \"source_amount\": \"478.5226401\",\n                \"destination_asset_type\": \"native\",\n                \"destination_amount\": \"0.5000000\",\n                \"path\": [\n                    {\n                        \"asset_type\": \"credit_alphanum4\",\n                        \"asset_code\": \"SAT2\",\n                        \"asset_issuer\": \"GCNTYYJORSDB3RYWVCNCWK4U5SCCOOZKOXVUQZP6KCVRYLAP6TWWJ3C5\"\n                    }\n                ],\n                \"max_source_amount\": \"480.9152533\"\n            },\n            \"netAmount\": \"99863.8536034\",\n            \"otherNetAmountThreshold\": \"99359.7491090\"\n        },\n        \"routePlan\": [\n            {\n                \"swapInfo\": {\n                    \"protocol\": \"sdex\",\n                    \"path\": [\n                        \"CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA\",\n                        \"CC6RNAVJWE4NRDZH64DLN4WD6PKUMP7DHDMS6SNEX5VHGJJDE57JZ6FU\"\n                    ]\n                },\n                \"percent\": \"100\"\n            }\n        ],\n        \"trustlineInfo\": {\n            \"trustlineCostAssetIn\": \"0.4792743\",\n            \"trustlineCostAssetOut\": \"100342.3762435\"\n        },\n        \"gaslessTrustline\": true,\n        \"platformFee\": {\n            \"feeBps\": 50,\n            \"feeAmount\": \"5000000\"\n        }\n    },\n    \"referralId\": \"GALAXYVOIDAOPZTDLHILAJQKCVVFMD4IKLXLSZV5YHO7VY74IWZILUTO\",\n    // MANDATORY\n    \"sponsor\": \"GDISPX62G6EGBZX3I2VMB4J3O3CPFHHRAJ4QZNOYVXYVHJ6BVRL2A3Y3\",\n    \"from\": \"GBRXTS3DLMPWGVRJU44J4SJOGLSPIS5FCMV5VYIVTNOIIRSMTZY4CMTX\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/quote/build?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"quote",
								"build"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Send Transaction",
			"item": [
				{
					"name": "Send",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"xdr\": \"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\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "{{host}}/send?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"send"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Liquidity",
			"item": [
				{
					"name": "Add",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "urlencoded",
							"urlencoded": [
								{
									"key": "assetA",
									"value": "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
									"type": "text"
								},
								{
									"key": "assetB",
									"value": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
									"type": "text"
								},
								{
									"key": "amountA",
									"value": "10000000",
									"type": "text"
								},
								{
									"key": "amountB",
									"value": "2598025",
									"type": "text"
								},
								{
									"key": "to",
									"value": "GB6LEFQDRNJE55Y5X7PDGHSXGK3CA23LWBKVMLBC7C4HISL74YH4QA4N",
									"type": "text"
								},
								{
									"key": "slippageTolerance",
									"value": "100",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "{{host}}/liquidity/add?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"liquidity",
								"add"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Remove",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "urlencoded",
							"urlencoded": [
								{
									"key": "assetA",
									"value": "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA",
									"type": "text"
								},
								{
									"key": "assetB",
									"value": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
									"type": "text"
								},
								{
									"key": "liquidity",
									"value": "18305475",
									"type": "text"
								},
								{
									"key": "amountA",
									"value": "38506067",
									"type": "text"
								},
								{
									"key": "amountB",
									"value": "10003972",
									"type": "text"
								},
								{
									"key": "to",
									"value": "GB6LEFQDRNJE55Y5X7PDGHSXGK3CA23LWBKVMLBC7C4HISL74YH4QA4N",
									"type": "text"
								},
								{
									"key": "slippageTolerance",
									"value": "100",
									"type": "text"
								}
							]
						},
						"url": {
							"raw": "{{host}}/liquidity/remove?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"liquidity",
								"remove"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Positions",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/liquidity/positions/:address?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"liquidity",
								"positions",
								":address"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								}
							],
							"variable": [
								{
									"key": "address",
									"value": "GB6LEFQDRNJE55Y5X7PDGHSXGK3CA23LWBKVMLBC7C4HISL74YH4QA4N"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Price",
			"item": [
				{
					"name": "price",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/price?network=mainnet&asset=CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75,CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV",
							"host": [
								"{{host}}"
							],
							"path": [
								"price"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								},
								{
									"key": "asset",
									"value": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75,CDTKPWPLOURQA2SGTKTUQOWRCBZEORB4BWBOMJ3D3ZTQQSGE5F6JBQLV"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "Pools",
			"item": [
				{
					"name": "All pairs",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/pools?network=mainnet&protocol=soroswap",
							"host": [
								"{{host}}"
							],
							"path": [
								"pools"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								},
								{
									"key": "protocol",
									"value": "soroswap"
								},
								{
									"key": "assetList",
									"value": "soroswap",
									"disabled": true
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "GetPair",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/pools/:tokenA/:tokenB?network=mainnet",
							"host": [
								"{{host}}"
							],
							"path": [
								"pools",
								":tokenA",
								":tokenB"
							],
							"query": [
								{
									"key": "network",
									"value": "mainnet"
								},
								{
									"key": "protocol",
									"value": "soroswap",
									"disabled": true
								},
								{
									"key": "assetList",
									"value": "soroswap",
									"disabled": true
								}
							],
							"variable": [
								{
									"key": "tokenA",
									"value": "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA"
								},
								{
									"key": "tokenB",
									"value": "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75"
								}
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "AssetList",
			"item": [
				{
					"name": "Soroswap asset list",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/asset-list",
							"host": [
								"{{host}}"
							],
							"path": [
								"asset-list"
							],
							"query": [
								{
									"key": "name",
									"value": "soroswap,aqua",
									"disabled": true
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "Stellar Expert asset list",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/asset-list?name=soroswap",
							"host": [
								"{{host}}"
							],
							"path": [
								"asset-list"
							],
							"query": [
								{
									"key": "name",
									"value": "soroswap"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "List not found",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/asset-list?name=somelist",
							"host": [
								"{{host}}"
							],
							"path": [
								"asset-list"
							],
							"query": [
								{
									"key": "name",
									"value": "somelist"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "All asset lists",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "{{host}}/asset-list",
							"host": [
								"{{host}}"
							],
							"path": [
								"asset-list"
							],
							"query": [
								{
									"key": "name",
									"value": "soroswap",
									"disabled": true
								}
							]
						}
					},
					"response": []
				}
			]
		}
	],
	"auth": {
		"type": "bearer",
		"bearer": [
			{
				"key": "token",
				"value": "{{api_key}}",
				"type": "string"
			}
		]
	},
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"exec": [
					""
				]
			}
		},
		{
			"listen": "test",
			"script": {
				"type": "text/javascript",
				"packages": {},
				"exec": [
					""
				]
			}
		}
	]
}
```
