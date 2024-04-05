### Bitcoin land usage comparison

UN [estimate](https://unu.edu/press-release/un-study-reveals-hidden-environmental-impacts-bitcoin-carbon-not-only-harmful-product)
that Bitcoin land footprint in 2021 is 1870 Km2.
Plugin calculation:

- The land usage is calculated as this pseudocode:
  ```python
  land_use = 0
  for c in countries_shares:
    for s in country_sector_shares:
      land_use += c*s*LUI* (total bitcoin power demand)
  ```
  - LUI - land usage intensity.
  - c: country power shares within bitcoin network
  - s: country energy sector shares
  - Land usage = `sum(c*s*LUI) * total bitcoin power demand`
  - We can calculate sum(c*s*LUI) = 0.028654865065823463 using 3
    files:  [bitcoin_mining_shares.json](../config/bitcoin_mining_shares.json),
    [electricity_generation_land_use_intensity.json](../config/electricity_generation_land_use_intensity.json), [bitcoin_mining_shares.json](../config/electricity_mix_by_countries.json)

We calculated in file [Bitcoin-water-consumption.md](Bitcoin-water-consumption.md) that
total bitcoin 2021 power consumption (produced by the plugin) is 66941925396 kWh

So the bitcoin land footprint in 2021 is 0.028654865065823463 * 66941925396 = 1918211839 m2
= 1918 Km2/year, compare to the value 1870 Km2 estimated by UN.

Difference = 2.5%.


