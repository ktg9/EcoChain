# Methodology for calculating Bitcoin transaction electronic waste

### Overview
Global waste is expected to grow by 70% by 2050 from 2016. 
Though it is less discussed, electronic waste (e-waste) – which is 
the waste produced by discarding electrical or electronic equipment – represents 
a growing threat to our environment and includes issues from toxic 
chemicals and heavy metals leaching into soils to air and water pollution caused by improper recycling.

Electronic waste contains hazardous substances,
usually heavy metals such as mercury, cadmium, or lead, 
and chemicals such as chlorofluorocarbons (CFCs),
hydrochlorofluorocarbons (HCFCs), and flame retardants. Some of the contaminants in e-waste pose serious 
health risks and can be responsible for kidney damage, and skin disorders, and affect the nervous and immune systems. 


Science Direct provides a [research](https://www.sciencedirect.com/science/article/abs/pii/S0921344921005103) 
to estimate Bitcoin's e-waste and find that it adds up to 30.7 metric kilotons annually, per May 2021; the research
also estimates that on average, each bitcoin transaction generates 272 g. That likes binning
2 iphone 12 minis.

### Background
The methodology for this plugin to estimate e waste per blockchain transaction
is heavily based on [Cambridge Methodology](https://ccaf.io/cbnsi/cbeci/methodology) and this 
[paper](https://www.researchgate.net/publication/354554919_Bitcoin's_growing_e-waste_problem).
While CBECI methodology is for calculating Bitcoin power demand, it could also be used
for calculating Bitcoin transaction electronic waste.

### Methodology

1. CBECI provides a list of [all mining equipments](http://sha256.cbeci.org/),
this list  was compiled from various public resources detailing different mining equipment types and their specifications.
The list contains detailed information about mining equipment such as release date, power demand, hashing power and
also their weight. The weight is the main parameter in calculating bitcoin transaction ewaste.

2. The methodology for this plugin requires that we assume these things:
   - `Mining nodes ('miners') are rational economic agents that only use profitable hardware`, this is also
    an important predicate for CBECI methodology
   - Mining equipment has a maximum economic lifetime of 5 years - `economic lifetime` here just means
    that after 5 years the mining equipment is removed from calculation. Therefore, in this plugin e waste 
   calculation, the average lifespan of all equipments is also 5 years.

3. Steps for estimating bitcoin e waste:
    - `Selecting mining equipment`: 
      + A list of active equipment, the [CBECI list](http://sha256.cbeci.org/) is used 
      ![Equipment list](img/ewaste_equipment_list.png)
    
    - `Calculate profitability threshold`:
        + The profitability threshold is measured in J/TH or W/TH. To be profitable, a mining equipment must
        have parameters that satisfies:
          (Power demand / Hashing power) < profitability threshold
        + In other words, the more hashing power, the more BTC an equipment -> more profit; the more power demand,
      the more electricity cost -> less profit. Therefore, (power demand/hashing power) must be smaller than a threshold
      to be profitable. 
        
        ![Profitability threshold](img/ewaste_profitability_threshold.png)
   
        + Here is the graph for profitability threshold provided by CBECI:
        
        ![Profitability chart](img/ewaste_profitability_chart.png)
    
    - `Create a list of profitable mining equipments`:
        + On a given day `d`, we can create a list of profitable mining equipments by using the list
        of all mining equipments and the profitability threshold
    - `Calculate weighting factors for each profitable mining quipments`:
        + Each profitable mining equipment is assigned a weight factor, the weight factor
      is a function based on current time and the deployment date of the equipment (deployment date is 2 months
      after release date).
       ![Weighting factor](img/ewaste_weighting_factor.png)
        
    - `Calculate the total equipment amount`:
        + The total equipment amount on day `d` is calculated as:
      
        ![Total equipment amount](img/ewaste_total_equipment_amount.png)
   
        + **weightfactor** is the factor calculated for each profitable mining equipments
        + **W** is the weight (in kg) of the equipment
        + **Hp** is the hash power of equipment (TH/s)
        + **H(d)** is the average hash rate on day `d`
        + This formula is derived from the [paper](https://www.researchgate.net/publication/354554919_Bitcoin's_growing_e-waste_problem)
    
    - `Calculate ewaste per day`:
        + Since the economic lifespan of all equipment is assumed to be 5 years
          the ewaste per day of bitcoin = (total equipment amount)/ (5*365.25)
        
    - `Calculate ewaste per bitcoin transaction`:
        +   After `ewaste per day` of the whole bitcoin network
      is available, the plugin will attempt to find relationship
      between `ewaste` and `hashrate` by linear regression:
        ewaste = b0 + b1*hashrate
      + If a model with high Rsquare if found, it will be used to calculate
      ewaste for each bitcoin transaction on day day `d` as: `( b0 + b1*hashrate(d)) / (total transactions (d))`


















