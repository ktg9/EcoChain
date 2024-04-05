## Avalanche transaction emissions calculation

### Data source and data preprocessing

Avalanche total transactions per day and total compute unit used per day
is obtained from running [Dune](https://dune.com/browse/dashboards) queries. Dune provides raw data tables about
blockchains for us to perform queries with aggregations to obtain the necessary data. One thing to note is that Dune's
Free Plan only has limited credit, and sometimes a heavy query may take a long time to run. If the run time is too long,
it will be terminated, so we need to run a query multiple times for different date ranges to get our data.

- `Avalanche transactions per day`: The data is retrieved
  from this [Dune query](https://dune.com/queries/3486952)
- `Avalanche total gas (compute unit) per day`: The data is retrieved
  from this [Dune query](https://dune.com/queries/3486975). We need to run
  this with different `blocktime` range each time to avoid timeout error.

File [avalanche_preprocess_data.py](avalanche_preprocess_data.py) is responsible for cleaning data.
The output is file [avalanche_gas.csv](data/avalanche_gas.csv) and
file [avalanche_transactions.csv](data/avalanche_transactions.csv)

### Avalanche emissions gas regression

The regression model is built in file [avalanche_emissions_gas_regression.py](avalanche_emissions_gas_regression.py)

- The result is a strong correlation of emissions and hashrate with data from
  2023-09-01 to 2024-02-27 with `R square` = 0.925969223623372

![Avalanche Emissions Gas Regression](img/avalanche_emissions_gas_linear_regression.png)

- Regression parameters are `b0: 371.1761123742084 , b1 : [4.89823124e-10]`
  This result can be interpreted as 1 gas processed by the node
  will produce 4.89823124e-10 g of CO2
