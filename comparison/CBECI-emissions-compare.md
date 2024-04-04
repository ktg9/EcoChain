### Compare Cambridge Bitcoin Electricity Consumption Index (CBECI) emission

- Compare date: 2024/04/03
- Link to CBECI result: https://ccaf.io/cbnsi/cbeci/ghg

![CBECI bitcoin emission](img/CBECI_bitcoin_emission.png)

- CBECI emission = 86.4*10**6 = 86400000 tons/year
- Plugin param:
  + b0 = 45854865890.77089
  + b1 = 3.21680913e-10
  + Hashrate = 605E+18 H/s (https://bitinfocharts.com/comparison/bitcoin-hashrate.html#3m)
  + plugin_daily_emission = b0 + b1*hashrate = 240471818255(g) = 240471 tons
  + plugin_annual_emission = plugin_daily_emission * 365.25 = 87832032 tons

Difference = (86400000 - 87832032)/87832032 = 1.6%


