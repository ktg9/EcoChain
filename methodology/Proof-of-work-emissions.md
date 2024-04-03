## Methodology for calculating proof of work blockchain transactions energy consumption


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
than a target value. Miners do this by repeatedly hashing the block header with different nonce values until they find a valid hash.

- Validating and Propagation: Once a miner finds a valid hash, they broadcast the new block to the network. Other nodes in the network 
validate the block by checking that the transactions are valid and that the hash meets the network's criteria. If the block is valid, 
it is added to the blockchain, and the process repeats for the next block.

- Consensus: The longest valid chain of blocks becomes the accepted blockchain. If multiple miners find valid blocks at the same time, 
a temporary fork may occur. However, the network automatically resolves forks by accepting the longest chain, which represents the majority 
of the network's computational power

- Block Reward: Miners are incentivized to participate in the network through block rewards. When a miner successfully mines a 
new block, they are rewarded with newly created cryptocurrency (e.g., Bitcoin) and transaction fees from the included transactions.

- Difficulty Adjustment: The difficulty of the proof-of-work puzzle is adjusted periodically to ensure that new blocks are mined at a consistent rate,
typically every 2016 blocks in Bitcoin (approximately every two weeks). If blocks are being mined too quickly, the difficulty increases, and if they are being mined too slowly, the difficulty decreases.


### Data sources for finding PoW blockchain network consumption
There are 2 organizations that have done a great job in estimating energy consumption
of Pow blockchains transactions: [Cambridge Bitcoin Electricity Consumption Index](https://ccaf.io/cbnsi/cbeci(CBECI))
and [Crypto Carbon Rating Institute(CCRI)](https://carbon-ratings.com/), in which the CCRI results of CBECI.

The methodology of this plugin for PoW blockchain is heavily based on the researches of 

Below is a simplified summary of [CBECI's methodology](https://ccaf.io/cbnsi/cbeci/methodology)  in determining Bitcoin energy consumption:

1. Selecting mining equipment:  
- First create [a list of mining equipments](https://docs.google.com/spreadsheets/d/15bkGk6cpIGK9DKcytnErB0VZfihPkF1TsAYd4_Nac_Y/edit), 
the list is compiled from various public resources detailing different mining equipment types and their specifications. This list will be used
to estimate lower bound and upper bound of how much energy cost for mining. Not that the list is created on assumption that 
`miners are rational economic agents who only operate their devices for as long as they are profitable` as stated in their paper.

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

### Finding the energy consumption of PoW blockchain transaction
Relying on the work of CBECI and CCRI, we can have a good estimation of
different blockchain networks energy consumption. To calculate the energy consumption for each
transaction, the plugin follows these steps:
- The total energy consumption is calculated based on hash rate. It's not possible to pinpoint the exact
hashrate of the PoW networks but it can be estimated. There are many sources for this estimation, 
and their numbers might vary slightly. CBECI and CCRI just provide the total energy consumption and not the hashrate
data that they rely on for calculation. Therefore, I decided to take another public data sources
for hashrate provided by [BitInfoCharts](https://bitinfocharts.com/comparison/bitcoin-hashrate.html) and find relationship
between this hashrate and total power demand using regression models.
- Once a regression model is calculated to fit the data, we can then calculate total power demand
using the model and user's input current hash rate
- The power demand for each transaction = (total power demand) / (total transactions). The plugin assume
that the power impact of each transaction is the same. The assumption is based on these facts:
    + Transactions might be different in sizes and types (Standard, Multi-Signature,...) and result
    in different power demand for processing them. However, this power demand is very small compared
    to the mining process, in which the miners are required to solve mathematical puzzles by hashing.
    + The differences of transactions does not affect the mining process, so the power demand for each transaction
    is equal.


      


### Terminology
- HashRate:  The total computational power that is being utilized by miners on the Bitcoin network to secure and process transactions. In PoW, miners
must use computational power to solve puzzle - guessing the correct answer by hashing a set of data many times until reaching the correct answer.
the hash rate in hashes per second (H/s),  kilo hashes per second (kH/s), mega hashes per second (MH/s), giga hashes per second (GH/s), tera hashes per second (TH/s)
and so on.  The more miners taking part in the blockchain, the higher hash rate is because PoW blockchain
will increase puzzle difficulty.
