### Calculate bitcoin environmental impact
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
            "carbon": 777.1462638608228,
            "ewaste": 117.04562027241327,
            "fresh_water": 32618.398678432943,
            "land": 39.68218341744669
          }
        ]
```
The unit here is carbon(gCO2), ewaste(g), fresh water (L) and land (m2/year)
So the output shows your bitcoin transaction impact:
- Emit 777g of carbon 
- Cause 117 g of electronic waste
- Consumes 32618 litres of fresh water
- Use 39 m2 of land for 1 year

### 
