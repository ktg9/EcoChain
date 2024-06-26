# Green Software Foundation Carbon Hack 2024

Project name: EcoChain - Sustainable Blockchain Transaction Environmental Impacts Measurement<br>
Author: [ktg9](https://github.com/ktg9) (Ky Tran)

### Project structure

1. [src](src) : GSF plugin source code and unit tests

2. [methodology](methodology): Contains markdown files demonstrating
   the methodology for calculating blockchain environmental impacts:

3. [data](data): This repository contains the source code (in Python) for calculating parameters required by the plugin,
   such as
   linear regression parameters. It also provides details on the data sources necessary for calculating these
   parameters. Each folder, such as [data/pos/bitcoin](data/pow/bitcoin), corresponds to a specific blockchain network.
   Within each folder,
   you'll find a file (or multiple files) that outlines the calculation process,
   e.g [data/pow/bitcoin/Bitcoin-transaction-ewaste.md](data/pow/bitcoin/Bitcoin-transaction-ewaste.md)

4. [config](config): Contains config file used in the source codes:

5. [comparison](comparison) Compare the plugin calculation of blockchain
   environmental impacts with other organizations estimation.

6. [examples](examples) Give examples of use cases of this plugin

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

To achieve this goal, the plugin will calculate the environmental impacts (carbon emissions, electronic waste,
freshwater consumption, and land conversion) of each blockchain transaction instead of attempting to generate a single
number for the entire blockchain.

### Result Summary

Below is a table summarizing supported blockchains and their environmental impacts:

| Blockchain                                  | Carbon emission | Electronic waste | Fresh water consumption | Land conversion |
|---------------------------------------------|-----------------|------------------|-------------------------|-----------------|
| [Bitcoin (btc)](data/pow/bitcoin)           | ✅               | ✅                | ✅                       | ✅               |
| [Bitcoin cash (bch)](data/pow/bitcoin_cash) | ✅               | ❌                | ❌                       | ❌               |
| [Bitcoin SV (bsv)](data/pow/bitcoin_sv)     | ✅               | ❌                | ❌                       | ❌               |
| [Dash (dash)](data/pow/dash)                | ✅               | ❌                | ❌                       | ❌               |
| [Dogecoin (doge)](data/pow/dogecoin)        | ✅               | ❌                | ❌                       | ❌               |
| [Litecoin (ltc)](data/pow/litecoin)         | ✅               | ❌                | ❌                       | ❌               |
| [Solana](data/pos/solana)                   | ✅               | ❌                | ❌                       | ❌               |
| [Avalanche (avax)](data/pos/avalanche)      | ✅               | ❌                | ❌                       | ❌               |

[Ethereum (eth)](data/pos/ethereum) is analyzed but the result model is not good enough
for calculating emission.

The unit of outputs is as follows:
- Carbon emission: gram CO2 (gCO2) 
- Electronic waste: gram (g)
- Fresh Water consumption: litre (L)
- Land conversion: m2/year (square meters per year)


























