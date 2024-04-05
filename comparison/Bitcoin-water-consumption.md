### Bitcoin Water Consumption Comparison

The result of this [paper](https://www.sciencedirect.com/science/article/pii/S2949790623000046#:~:text=estimate%20that%20Bitcoin%20mining%20was,manage%20the%20limited%20freshwater%20supply.) estimates Bitcoin 2021 water consumption to be about 1573.7 GL

Plugin calculation according to [Bitcoin water consumption](../methodology/Bitcoin-water-consumption.md):

- Plugin indirect water consumption = `sum(country_share * total power demand * country_water_intensity)`

  - If we use country shares in [bitcoin_mining_shares.json](../config/bitcoin_mining_shares.json) and water intensity in [electricity_water_intensity.json](../config/electricity_water_intensity.json):

    - US indirect water consumption: power * 37.84 * 2.790550498 / 100
    - CN indirect water consumption: power * 21.11 * 1.675160972 / 100
    - KZ indirect water consumption: power * 13.22 * 82.0471208 / 100
    - CA indirect water consumption: power * 6.48 * 15.47528148 / 100
    - RU indirect water consumption: power * 4.66 * 32.38640411 / 100
    - DE indirect water consumption: power * 3.06 * 1.494519963 / 100
    - MY indirect water consumption: power * 2.51 * 6.799642589 / 100
    - IE indirect water consumption: power * 1.97 * 1.512062756 / 100
    - IR indirect water consumption: power * 0.12 * 2.010000626 / 100
    - Other countries water consumption: power * 9.02 * 49.08322748667114 / 100
  - Plugin indirect water = (sum of the above countries) =  power * 19.444114927016237
  - Using data in [bitcoin_hashrate_2021.csv](data/bitcoin_hashrate_2021.csv), total power = `365*b0 + b1*(total hashes in 2021) = 66941925396 kWh`

Plugin indirect water consumption = 66941925396 * 19.444114927016237 = 1301626490835 L = 1301 GL
Plugin direct water consumption = 66941925396 * 1.8 = 120 GL

Plugin total water consumption = 1421 GL

Difference with the paper estimation = (1573 - 1421)/1573 = 9.6%
