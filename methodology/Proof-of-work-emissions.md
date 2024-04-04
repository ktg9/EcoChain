## Methodology for calculating proof of work blockchain transactions emission

### PoW (Proof of work) blockchain definition

Proof-of-work (PoW) is a blockchain consensus mechanism that incentivizes
network validation by rewarding miners for adding computational power and difficulty to the network.

PoW blockchains like Bitcoin, Dogecoin, Litecoin,... uses PoW consensus mechanism.

### How PoW works

The PoW mechanism is illustrated in these concepts:

- Transactions: Users initiate transactions by sending cryptocurrency (Bitcoin, Dogecoin,..) from one address
  to another. These transactions are broadcast to the network and collected by nodes.

- Block formation: Transactions are grouped together into blocks.
  Miners, who are participants in the network with specialized hardware,
  compete to create new blocks. Each block contains a set of transactions and a reference to the previous block,
  forming a chain of blocks, hence the name "blockchain."

- Mining: Miners compete to solve a complex mathematical puzzle known as the proof-of-work puzzle.
  The puzzle requires miners to find a hash value that meets a certain criteria, such as being less
  than a target value. Miners do this by repeatedly hashing the block header with different nonce values until they find
  a valid hash.

- Validating and Propagation: Once a miner finds a valid hash, they broadcast the new block to the network. Other nodes
  in the network
  validate the block by checking that the transactions are valid and that the hash meets the network's criteria. If the
  block is valid,
  it is added to the blockchain, and the process repeats for the next block.

- Consensus: The longest valid chain of blocks becomes the accepted blockchain. If multiple miners find valid blocks at
  the same time,
  a temporary fork may occur. However, the network automatically resolves forks by accepting the longest chain, which
  represents the majority
  of the network's computational power

- Block Reward: Miners are incentivized to participate in the network through block rewards. When a miner successfully
  mines a
  new block, they are rewarded with newly created cryptocurrency (e.g., Bitcoin) and transaction fees from the included
  transactions.

- Difficulty Adjustment: The difficulty of the proof-of-work puzzle is adjusted periodically to ensure that new blocks
  are mined at a consistent rate,
  typically every 2016 blocks in Bitcoin (approximately every two weeks). If blocks are being mined too quickly, the
  difficulty increases, and if they are being mined too slowly, the difficulty decreases.

### Data sources for finding PoW blockchain network emission

There are 2 organizations that have done a great job in estimating emission
of Pow blockchain networks: [Cambridge Bitcoin Electricity Consumption Index](https://ccaf.io/cbnsi/cbeci(CBECI))
and [Crypto Carbon Rating Institute(CCRI)](https://carbon-ratings.com/), in which the CCRI results of CBECI.

The methodology of this plugin for PoW blockchain is heavily based on the researches of the above organizations.

Below is a simplified summary of [CBECI's methodology](https://ccaf.io/cbnsi/cbeci/methodology)  in determining Bitcoin
emission:

1. Selecting mining equipment:

- First
  create [a list of mining equipments](https://docs.google.com/spreadsheets/d/15bkGk6cpIGK9DKcytnErB0VZfihPkF1TsAYd4_Nac_Y/edit),
  the list is compiled from various public resources detailing different mining equipment types and their
  specifications. This list will be used
  to estimate lower bound and upper bound of how much energy cost for mining. Not that the list is created on assumption
  that
  `miners are rational economic agents who only operate their devices for as long as they are profitable` as stated in
  their paper.

2. Constructing the lower bound estimate per tera hash:

- The lower bound power demand (per tera hashes) is calculated as the energy consumption of the most
  efficient mining hardware in the mining equipment list. The power demand is measured in J/TH

3. Constructing the upper bound estimate per tera hash:

- The upper bound power demand (per tera hashes) is calculated as the energy consumption of the least
  efficient but still profitable mining hardware in the mining equipment list. The power demand is measured in J/TH

4. Constructing the best-guess estimate per tera hash:

- A best guess power demand (per tera hashes) is calculated by assigning each mining hardware
  in the list a weight and then calculate weighted average energy efficiency of profitable mining hardware.
  The power demand is measured in J/TH

5. Calculate the best-guess power demand:

- Best guess power demand = (best-guess power demand per tera hash) * (average hashes each day)

6. CCRI then uses mining nodes spatial distribution to calculate emission based on power demand.

### Finding the emission of PoW blockchain transaction

The plugin methodology relies on the concept of blockchain `hash rate`. Hash rate is the total computational power that
is being utilized by miners on the Bitcoin network to secure and process
transactions.In PoW (Proof of Work) systems, miners are required to employ computational power to solve a cryptographic
puzzle. This involves repeatedly hashing a set of data until the correct answer is found. The hash rate is typically
measured in hashes per second (H/s), kilo hashes per second (kH/s), mega hashes per second (MH/s), giga hashes per
second (GH/s), tera hashes per second (TH/s), and so forth. As more miners participate in the blockchain network, the
hash rate increases because PoW blockchains adjust puzzle difficulty to maintain a consistent block generation time
Generally speaking, the larger the hash rate value, the more computational required and the more carbon emission.

Relying on the work of CBECI and CCRI, we can obtain a reliable estimation of carbon emission for various blockchain
networks. To calculate the carbon emission for each transaction, the plugin follows these steps:

1. Get hash rate data: It's challenging to determine the precise hash rate of PoW (Proof of Work) networks, but
   estimations can be made. There are several sources available for making these estimations, although their figures may
   vary slightly. It's worth noting that while CBECI and CCRI offer blockchain carbon emission data, they do not provide
   the hash rate data used for their calculations.. Therefore, I decided to take another public data sources
   for hashrate provided by [BitInfoCharts](https://bitinfocharts.com/comparison/bitcoin-hashrate.html).
2. Get emission data: Blockchain Emission data is provided
   by [CCRI API](https://docs.api.carbon-ratings.com/v2/#/calls_network)
3. Construct regression model: A regression model is then constructed to find the relationship between daily emission
   and average daily hash rate.
   If a strong
   correlation is discovered, the model can then be utilized to estimate emission based on future hash rate value.

4. Calculate emission per transaction:

- Once a regression model is calculated to fit the data, we can then calculate daily emission
  using the model and user's input current hash rate
- The emission for each transaction = `(daily emission) / (daily transactions)`. The plugin assume
  that the power impact of each transaction is the same. The assumption is based on these facts:
  + Transactions might be different in sizes and types (Standard, Multi-Signature,...) and result
    in different power demand for processing them. However, this power demand is very small compared
    to the mining process, in which the miners are required to solve mathematical puzzles by hashing.
  + The differences of transactions does not affect the mining process, so the carbon emission for each transaction
    is the same.

### Reference

1. CBECI methodology: https://ccaf.io/cbnsi/cbeci/methodology
2. CCRI API: https://v2.api.carbon-ratings.com/documentation
