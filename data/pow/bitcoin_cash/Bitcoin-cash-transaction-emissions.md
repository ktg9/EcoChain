## Bitcoin Cash transaction emissions calculation

### Data source and data preprocessing

- `Bitcoin cash total emissions per day`:
    + File location: [data/raw/bitcoin_cash_ccri_emissions.json](data/raw/bitcoin_cash_ccri_emissions.json)
    + This data is obtained from [Crypto Carbon Rating Institue API](https://docs.api.carbon-ratings.com/v2/#/)

- `Bitcoin cash average hashrate per day`:
    + File location: [data/bitcoin_cash_hashrate.csv](data/bitcoin_cash_hashrate.csv)
    + This data is crawled from [bitinfocharts](https://bitinfocharts.com/comparison/hashrate-bch.html)

### Bitcoin cash transaction emissions calculation

1. `Data cleaning`: This step will clean/convert raw data from various
   sources for later steps:
    - File [ccri_pow_preprocessing_data.py](../ccri_pow_preprocessing_data.py) is used for cleaning CCRI pow emissions data for
      all blockchains including bitcoin cash, change variable `blockchain = 'bitcoin_cash''` to run.
      The result is file [bitcoin_cash_emissions.csv](data/bitcoin_cash_emissions.csv)

2. `Linear regression`

- File [bitcoin_cash_emissions_hashrate_linear_regression.py](bitcoin_cash_emissions_hashrate_linear_regression.py) is responsible
  for finding the relationship of emissions per day and average hashrate per day.

- The result is a quite strong correlation of emissions and hashrate with data from
  2022-01-01 to 2024-03-19 with `R square` = 0.8670736183471788

![Bitcoin Cash Emissions Hashrate Linear Regression](img/bitcoin_cash_emissions_hashrate_linear_regression.png)


- Regression parameters are `b0: 225006.29710408265 , b1 : [3.93560793e-13]`












