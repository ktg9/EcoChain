### Calculate bitcoin transaction environmental impact
[Input yaml file](yml/basic_usage_btc.yml):
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
        blockchain: btc
tree:
  children:
    child-0:
      pipeline:
        - ecochain
      inputs:
        - hash_rate: 576.04e18
          daily_transactions: 297442
```
Bitcoin hash rate and daily transactions data could be retrieved from [bitinfocharts](https://bitinfocharts.com/bitcoin/)

Outputs:
```json
 [
  {
    "hash_rate": 576040000000000000000,
    "daily_transactions": 297442,
    "carbon": 777146.2638608229,
    "ewaste": 117.04562027241327,
    "fresh_water": 32618.398678432943,
    "land": 43.99694262855391
  }
]
```
The unit here is carbon(gCO2), ewaste(g), fresh water (L) and land (m2/year).
So the output shows your bitcoin transaction impact:
- Emit 777146 g or 777kg of Co2 
- Cause 117 g of electronic waste
- Consumes 32618 litres of fresh water
- Use 44 m2 of land for 1 year

### Calculate Solana transaction carbon emission
Calculate carbon emission for this [transaction](https://explorer.solana.com/tx/27q7NcqjQBHPGWidFg5vB2eY6ih5B1kXhyf4RguPsWuki4PJUcWMDtVfGZxvPuZi5EC2ATh3Ac7VkKipHJoEeEjU)

Total compute unit: 241929
Total node count (validators): 1727, get data from [this site](https://www.validators.app)
Input: [basic_usage_sol.yml](yml/basic_usage_sol.yml)

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
        blockchain: sol
tree:
  children:
    child-0:
      pipeline:
        - ecochain
      inputs:
        - gas_used: 241929
          node_count: 1727

```
Output:
```json
 [
  {
    "gas_used": 241929,
    "node_count": 1727,
    "carbon": 0.0042458986295928775
  }
]

```
It means this transaction emits 0.0042 g of CO2

