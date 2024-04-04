## Litecoin transaction emissions calculation

### Litecoin source and data preprocessing

- `Litecoin total emissions per day`:
    + File location: [data/raw/litecoin_ccri_emissions.json](data/raw/litecoin_ccri_emissions.json)
    + This data is obtained from [Crypto Carbon Rating Institue API](https://docs.api.carbon-ratings.com/v2/#/)

- `Litecoin average hashrate per day`:
    + File location: [data/litecoin_hashrate.csv](data/litecoin_emissions.csv)
    + This data is crawled from [bitinfocharts](https://bitinfocharts.com/comparison/hashrate-ltc.html)

### Litecoin transaction emissions calculation

1. `Data cleaning`: This step will clean/convert raw data from various
   sources for later steps:
    - File pow/ccri_pow_preprocessing_data.py is used for cleaning CCRI pow emissions data for
      all blockchains including litecoin, change variable `blockchain = 'litecoin''` to run.
      The result is file [litecoin_emissions.csv](data/litecoin_emissions.csv)

2. `Linear regression`

- File [litecoin_emissions_hashrate_linear_regression.py](litecoin_emissions_hashrate_linear_regression.py) is responsible
  for finding the relationship of emissions per day and average hashrate per day.

- The result is a quite strong correlation of emissions and hashrate with data from
  2022-01-01 to 2024-03-19 with `R square` = 0.9697607188658373

![Litecoin Emissions Hashrate Linear Regression](img/litecoin_emissions_hashrate_linear_regression.png)

- Regression parameters are `b0: 217790973.50559044 , b1 : [6.67931768e-06]`












