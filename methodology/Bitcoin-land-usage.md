# Methodology for calculating bitcoin transaction land usage

### Overview

Land conversions is listed as an [ecological ceiling](https://guides.co/g/doughnut-economy/170288)

According to Stockholm Resilience Centre: "Land is converted to human use all over the planet.
Forests, grasslands, wetlands and other vegetation types have primarily been converted to agricultural land.
This land-use change is one driving force behind the serious reductions in biodiversity, and it has impacts on
water flows and on the biogeochemical cycling of carbon, nitrogen and phosphorus and other important elements.
While each incident of land cover change occurs on a local scale, the aggregated impacts can have consequences for
Earth system processes on a global scale. A boundary for human changes to land systems needs to reflect not just
the absolute quantity of land, but also its function, quality and spatial distribution. Forests play a particularly
important role in controlling the linked dynamics of land use and climate, and is the focus of the boundary for land
system change."

Bitcoin land footprint is also a serious
issue. [UN study](https://unu.edu/press-release/un-study-reveals-hidden-environmental-impacts-bitcoin-carbon-not-only-harmful-product)
estimates that Bitcoin footprint is about 1.4 times the area of the Los Angeles (1,870 square kilometers). If we take
population density as 16 people/km2 (global average), that area can be inhabited by 30,000 people.

### Methodology

The methodology of this plugin to estimate bitcoin transaction land use is based on
this [paper](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2023EF003871)
and data from [CCRI API](https://v2.api.carbon-ratings.com/documentation). Below is the summary of the methodology:

1. `Land use intensity`: Land use intensity (LUI) is a known socioecologic metric that attempts to calculate how much
   land is required in order to obtain a certain product.
   LUI is an extremely important metric because the more land is used in a certain process, the less land is available
   for other, sometimes nobler applications such as food production,
   the more social strife there is, and the more conflicts occur due to land distribution.
   In this methodology, we will look specifically Land use intensity of electricity production.

2. Electricity production LUI will estimate how much land is required to produce electricity. For example:

![Land Use Intensity of electricity production](img/land_LUI_examples.png)
The unit here is ha/TWH/y so can see from column `LUIE Median` that to produce 1 TWH of `Hydroelectric`,
650 ha of land must be used in a year.
The plugin uses LUI values of this [research](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0270155#pone-0270155-t001).

3. With the above data, we can estimate how much land Bitcoin uses if we know
how much electricity it consumes and the distribution of electricity consumption across
different technologies (hydroelectric, nuclear,...).

To do this, the methodology relies on 2 data sources:
- [CCAF mining map](https://ccaf.io/cbnsi/cbeci/mining_map), this will provide
information about how much bitcoin total hashrate distribution (e.g China 21.1%, us 37.8%, etc...)
We assume in this situation that hashrate distribution is also power demand distribution. 
- The International Energy Agency (IEA) on electricity sources of each country.
For example, [us electricity sources](https://www.iea.org/countries/united-states/electricity)

![IEA electricity sources](img/land_iea_example.png)

In here we then need to assume that the electricity to mine Bitcoin is distributed
the same with the country's electricity distribution across different technologies (Coal, Oil,...)

4. Calculate Bitcoin transaction land use:
- First a regression model is built to find relationship between hashrate and power demand,
if a strong correlation found, we can use the model to calculate power demand based on future hashrate.
- Then bitcoin land use can be calculated as follow:
  + First get the total Bitcoin power demand
  + Then use mining map to calculate each country Bitcoin electricity consumption
  + Then use IEA data to calculate land footprint for each country as:
  `country Bitcoin land footprint = sum(sector_share * sector_LUI)`.
  In that `sector_share` is the energy sector (Coal, Nuclear,...) share in the country electricity mix,
  `sector_LUI` is the sector land usage intensity.

- Calculate Bitcoin transaction land use  = (bitcoin daily land use)/(daily transactions)
