# Methodology for calculating proof of state blockchain transactions energy consumption

### Overview

Proof-of-stake is a cryptocurrency consensus mechanism for processing
transactions and creating new blocks in a blockchain. Examples of PoS blockchains
include Solana, Polkadot, Cosmos, Avalanche,... Ethereum was first a Proof-of-work (PoW) blockchain
but after [the merge](https://ethereum.org/en/roadmap/merge/) they have since become
a Pos blockchain and reduces its [energy consumption](https://ethereum.org/en/energy-consumption/) by 99.99%.

Here's a summary of how PoS works:

- `Staking`: In a PoS system, participants (also called validators or stakeholders) are required
  to lock up a certain amount of cryptocurrency tokens as collateral, known as their stake. This
  stake is used as a form of security deposit to incentivize honest behavior. For example, you need 32 ETH
  to activate Ethereum validator software.

- `Selection of validators`: Validators are chosen to create new blocks and validate transactions based
  on the amount of cryptocurrency tokens they have staked. Generally, the higher the stake a validator holds,
  the higher the chance they have of being selected to validate transactions and earn rewards

- `Block creation and validation`: Validators take turns proposing and validating blocks of transactions.
  The probability of being chosen to propose a new block is typically proportional to the validator's stake.
  Once a validator is selected, they create a new block containing transactions and add it to the blockchain.

- `Block Finalization and Consensus`: : Other validators verify the proposed block and check whether it meets
  the consensus rules of the network. If the block is valid, it is added to the blockchain. Consensus is achieved
  when a supermajority of validators agree on the validity of the proposed block.
- `Reward Distribution`: Validators who successfully propose and validate blocks are rewarded with transaction fees
  and newly minted cryptocurrency tokens. The rewards are distributed based on the validator's stake and their
  contribution to the network.

- `Slashing`: Validators are incentivized to behave honestly, as malicious behavior can result in a portion of their
  stake being slashed
  (i.e., confiscated). Malicious behavior may include attempting to validate invalid transactions or double-spending.

One important thing to note is the PoS blockchain does not require validators to solve complex
mathematical puzzles; therefore the energy consumption of Pos blockchains are very small compared to
Pow blockchains.

### CCRI Methodology to find Pos blockchain node power demand

The methodology for finding blockchain transaction energy consumption is based
on [CCRI research](https://carbon-ratings.com/dl/pos-report-2023)
Blow is a summary of CCRI methodology:

1. Analyze the selected PoS networks and their minimum hardware requirements

- The hardware requirements are an indicator of the hardware composition of the network.
- CCRI uses this information and additional hardware data from PassMark (Passmark Software, 2021) to select and obtain
  hardware that
  they use to measure a single node's electricity consumption.

2. Measure the electricity consumption of a single node and provide upper and lower
   bounds for each network:

- CCRI starts by running the software required by the respective network on all selected
  hardware devices and measure their electricity consumption while running the network and while idling.
- CCRI also captures further data points, such as CPU utilization and processed blocks, to be able to evaluate
  additional metrics.

3. Estimate the electricity consumption of the entire networks:

- Firstly, CCRI collects information about the size of the network, as the node count significantly influences
  the total amount of electricity consumed
- Secondly, CCRI develops a weighting between the single hardware devices for each network.
- Lastly, they multiply the electricity consumption of the weighted nodes by the number of nodes in the network.

4. Calculate the energy efficiency of transaction throughput for each network:

- CCRI takes samples of the nodes’ electricity consumption periodically and examine the number of transactions that the
  single nodes handled during the respective time periods. This allows them to describe the marginal influence of the
  number
  of transactions on the electricity consumption of a node in a specific network.
- As a result, CCRI establishes a model to estimate a node’s power consumption based on the number of transactions. This
  also enables them to track the electricity consumption of a network over time, as node count and transaction volume
  change.

The result of the 4th step is a table reflecting energy consumption of each node
on each network (ethereum, solana,...) and also marginal power consumption measured in w/tps/s.
![Pos marginal power](img/pos_marginal_power_1.png)
![Pos marginal power](img/pos_marginal_power_2.png)

### The plugin methodology for calculating blockchain transaction power demand

The methodology is explained in these steps:

1. Find relation between number of gas consumed and transactions:
    - The core of the methodology is based on the concept of `gas`. Gas is a unit that measures
      the amount of computational effort required to execute specific operations on PoS blockchain network. Some
      blockchains
      define this unit as `gas`, some call it `compute unit` like solana. Users need to pay gas fee in native tokens for
      the network
      to process their transactions. One thing to note here is that not every PoS network have this notion of compute
      unit or gas. Algorand for example,
      has no concept of gas fees, the transactions fee is solely determined by the transaction size (not by transaction
      complexity)

    - The plugin attempt to find the relationship between power demand of a single node and total number
      of gas consumed on the network. This relationship will describe how the increasing of gas affect the increasing of
      energy consumption. To find this relationship, the plugin gather these data from different data sources:
        + Total gas/compute unit consumed per day of a network
        + Total transactions per day of a network
        + With total transactions, we can calculate throughput (tps) and then find power demand for each node
          base on CCRI table. For example, to calculate each Solana node power consumption with
          tps = 2000 (transactions per second):

      `power demand = (base power demand) + (marginal power demand per tps) * tps = 313.9651 + 2000*0.0130 = 339.9651 w`


2. Calculate the energy consumption for each blockchain transaction :
    - First obtain the gas/compute unit consumption of transaction -> this is input by user
    - Then calculate how much energy a single node will consume for processing transaction with that
      amount of gas
    - The total energy consumption the network has to spend to process the transaction
      = (energy consumption per node) * total number of node -> this number is also from user input

   In summary, user will input the current total number of node and how much gas their transactions consume,
   they receive how much energy their transactions cost.






