# Green Software Foundation Carbon Hack 2024

Project name: EcoChain - Sustainable Blockchain Environmental Impacts Measurement<br>
Author: [ktg9](https://github.com/ktg9) (Ky Tran)

## Introduction

### Blockchain environmental impact problem

Blockchain is one of the fastest-growing fields these days. Since the creation of Bitcoin in 2008, the market value has
grown to an estimated $1.09 trillion as of August 2023, according to CoinMarketCap. The blockchain sector has evolved
from just a single cryptocurrency (Bitcoin) to a vast ecosystem that includes hundreds of blockchain networks, DeFi,
smart contracts, and more, fueling the emergence of major players like Binance and Uniswap.

However, alongside its
development, blockchain also has its dark sides, one of which is its large energy consumption. Bitcoin alone is
estimated to consume 127 terawatt-hours (TWh) a year — more than the energy consumption of many countries, including
Norway. In the United States, cryptocurrency activity is estimated to emit from 25 to 50 million tons of CO2 each year,
comparable to the annual emissions from diesel fuel used by US railroads.

Bitcoin's water footprint was similar to the amount of water required to fill over 660,000 Olympic-sized swimming pools,
enough to meet the current domestic water needs of more than 300 million people in rural sub-Saharan Africa. The land
footprint of worldwide Bitcoin mining activities during this period was 1.4 times the area of Los Angeles.

### Goal of this plugin

Many reputable organizations with solid research backgrounds have conducted thorough estimations regarding the
environmental impact of blockchain technology, including electricity consumption, water consumption, land use,...
However, the majority of
these estimations focus on demonstrating the total energy consumption of the entire blockchain network. While this is
valuable for illustrating the overall environmental impact of blockchains, these figures do not specifically convey to
blockchain users the environmental consequences of their actions, such as participating in the crypto market.

Blockchain users encompass cryptocurrency investors, smart contract developers, financial organizations utilizing
blockchain technology, and many others.

This GSF plugin aims to illustrate to everyday users (investors, developers, etc.) the environmental impact of their
actions when interacting with blockchain ecosystems. Specifically, the plugin will seek to address the following
questions for blockchain users:

- As a cryptocurrency user, how much energy/water/land is consumed when I transfer Bitcoin to another wallet?
- As a smart contract developer, how much energy/water/land will my smart contract consume when it's deployed on
  different blockchains like Ethereum, Solana, Avalanche, etc.?
- How much energy does USDC consume?

I believe that quantifying the environmental impact associated with users' actions will be impactful and will better
educate users about the environmental issues related to blockchain technology as a whole. That's the purpose of this
plugin: to demonstrate to the majority of blockchain users the environmental impact of their actions.

### Project structure

1. [src](src) : GSF plugin source code and unit tests

2. [methodology](methodology): Contains markdown files demonstrating
   the methodology for calculating blockchain environmental impacts:

- [Proof-of-stake-emissions.md](methodology/Proof-of-stake-emissions.md): methodology for calculating
  Proof of stake blockchains transaction emission
- [Proof-of-work-emissions.md](methodology/Proof-of-work-emissions.md): methodology for calculating
  Proof of work blockchains transaction emission
- [Bitcoin-ewaste.md](methodology/Bitcoin-ewaste.md): methodology for calculating
  Bitcoin transaction electronic waste
- [Bitcoin-water-consumption.md](methodology/Bitcoin-water-consumption.md): methodology for calculating
  Bitcoin transaction water consumption
- [Bitcoin-land-usage.md](methodology/Bitcoin-land-usage.md): methodology for calculating Bitcoin transaction
  land usage

3. [data](data): This repository contains the source code (in Python) for calculating parameters required by the plugin,
   such as
   linear regression parameters. It also provides details on the data sources necessary for calculating these
   parameters. Each folder, such as [data/pos/bitcoin](data/pow/bitcoin), corresponds to a specific blockchain network.
   Within each folder,
   you'll find a file (or multiple files) that outlines the calculation process,
   e.g [data/pow/bitcoin/Bitcoin-transaction-ewaste.md](data/pow/bitcoin/Bitcoin-transaction-ewaste.md)

4. [config](config): Contains config file used in the source codes:
  - [ecochain_metadata.json](config/ecochain_metadata.json):
    + `supported_blockchains`: contains supported blockchains, this is used for
      validating user input
    + `blockchain_config`: contains each blockchain information along with
      their models for environmental impact calculation. These numbers are derived
      from the result of [data](data) folder calculation. For example:
    ```json
    {
     "name": "Bitcoin Cash",
     "type": "pow",
     "models": [
       {
         "type": "linear_regression",
         "impact": "carbon",
         "b0": 225.00629710408225,
         "b1": 3.93560793e-16
       }
     ]
    }
    ```
  - [electricity_generation_land_use_intensity.json](config/electricity_generation_land_use_intensity.json): contains
    information about land usage intensity in m2/kWh/year of electricity generation technologies.
  - [electricity_mix_by_countries.json](config/electricity_mix_by_countries.json): electricity mix (shares) in percent by countries
  crawled from IEA (International Energy Agency)
  - [electricity_water_intensity.json](config/electricity_water_intensity.json): electricity water intensity
  in L/kWh by countries.

5. [comparison](comparison) Compare the plugin calculation of blockchain 
environmental impacts with other organizations estimation.

6. [examples](examples) Give examples of use cases of this plugin
### Result Summary

List of supported blockchains and their environmental impacts:

- [Bitcoin (btc)](data/pow/bitcoin): carbon emission, electronic waste, fresh water consumption, land consumption.
- [Bitcoin cash (bch)](data/pow/bitcoin_cash): carbon emission
- [Bitcoin SV (bsv)](data/pow/bitcoin_sv): carbon emission
- [Dash (dash)](data/pow/dash): carbon emission
- [Dogecoin (doge)](data/pow/dogecoin): carbon emission
- [Litecoin (ltc)](data/pow/litecoin): carbon emission
- [Solana (sol)](data/pos/solana): carbon emission
- [Avalanche (avax)](data/pos/avalanche): carbon emission

[Ethereum (eth)](data/pos/ethereum) is analyzed but the result model is not good enough
for calculating emission.






























