### Avalanche USDC carbon emission

Steps to estimate USDC carbon emission
- Withdraw crypto
- Deposit crypto
- Claim Reward
-

1. Get the address of USDC by search USDC in [avascan](https://avascan.info/blockchain/c/token/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E)
site. The address is 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
2. Query dune for total gas consumed by transaction with target = USDC:
```sql
SELECT
  sum(gas_used),
  block_date
FROM avalanche_c.transactions
WHERE
  block_time >= CAST('2024-03-01' AS TIMESTAMP)
  AND block_time < CAST('2024-04-01' AS TIMESTAMP)
  and to = 0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E
Group by block_date
order by block_date desc
```
In this query, we calculate the carbon emission of USDC on March 2024.
Result is 542459122

4. Get the total Avalanche validator in https://avascan.info/blockchain/c/info
Result is 1811
3. Run the EcoChain plugin with yaml file:

```yaml
name: ecochain-demo
description:
tags:
initialize:
  plugins:
    ecochain:
      path: 'https://github.com/ktg9/EcoChain'
      method: EcoChain
      global-config:
        blockchain: avax
tree:
  children:
    child-0:
      pipeline:
        - ecochain
      inputs:
        - gas_used: 542459122
          node_count: 1811

```
The output is 
```json
[
          {
            "gas_used": 542459122,
            "node_count": 1811,
            "carbon": 481.19903844419053
          }
        ]

```
Which means USDC coin on Avalanche produces 481 g of Co2 on March 2024.















