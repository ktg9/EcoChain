import {PluginParams} from './types';
import {validateInput} from './validation';

import {getMiningSharesData} from './helper';

/**
 * Calculate Proof-of-work blockchain environmental impacts
 * @param inputs received from yml file
 * @param models models list, models include parameters for calculation. E.g, if it's linear regression, models include
 * b0 and b1
 * @param defaulMiningShares default mining shares for each country
 * @param electricityWaterIntensity electricity water intensity in L/kWH for each country
 * @param electricityMixByCountries electricity mix by countries
 * @param electricityGenerationLandUseIntensity electricity generations land use intensity
 * @return PluginParams
 */
export const powCalculation = (
  inputs: PluginParams[],
  models: any[],
  defaulMiningShares: any,
  electricityWaterIntensity: any,
  electricityMixByCountries: any,
  electricityGenerationLandUseIntensity: any
): PluginParams[] => {
  return inputs.map((input, index) => {
    validateInput(input, index, 'pow');
    // Calculate Proof-of-Work footprints
    const hashRate = input['hash_rate'];
    const dailyTransactions = input['daily_transactions'];
    const miningSharesFile = input['mining_shares_file'];
    const output: any = {};
    models.map(model => {
      const type = model['type'];
      const b0 = model['b0'];
      const b1 = model['b1'];
      if (type === 'fresh_water') {
        output[type] = powWaterConsumption(
          b0,
          b1,
          hashRate,
          dailyTransactions,
          miningSharesFile,
          defaulMiningShares,
          electricityWaterIntensity
        );
      } else if (type === 'land') {
        output[type] = powLandUsage(
          b0,
          b1,
          hashRate,
          dailyTransactions,
          miningSharesFile,
          defaulMiningShares,
          electricityMixByCountries,
          electricityGenerationLandUseIntensity
        );
      } else {
        output[type] = (b0 + b1 * hashRate) / dailyTransactions;
      }
    });
    return {
      ...input,
      ...output,
    };
  });
};

/**
 * Calculate PoW transaction land usage
 * @param b0 b0 param of power demand linear regression model
 * @param b1 b1 param of power demand linear regression model
 * @param hashRate the current hash rate
 * @param dailyTransactions daily transactions
 * @param miningSharesFile mining shares file path input by user
 * @param defaultMiningShares default mining shares
 * @param electricityMixByCountries electricity mix by countries
 * @param electricityGenerationLandUseIntensity electricity generation land use intensity
 * @return land use per PoW transaction in m2/year
 */
export const powLandUsage = (
  b0: number,
  b1: number,
  hashRate: number,
  dailyTransactions: number,
  miningSharesFile: any,
  defaultMiningShares: any,
  electricityMixByCountries: any,
  electricityGenerationLandUseIntensity: any
): number => {
  // Get mining shares data
  const miningSharesData = getMiningSharesData(
    miningSharesFile,
    defaultMiningShares
  );
  const powerDemand = b0 + b1 * hashRate;

  // Calculate total land use
  let totalLandUsage = 0;

  // For each country in mining shares data
  Object.keys(miningSharesData).forEach(country => {
    if (electricityMixByCountries[country] === undefined) {
      return;
    }
    const miningShare = miningSharesData[country];
    const country_power_demand = (powerDemand * miningShare) / 100;
    // For each electricity generation technology (biomass, hydro,...) within a country
    Object.keys(electricityMixByCountries[country]).forEach(sector => {
      const sector_power_demand =
        (country_power_demand * electricityMixByCountries[country][sector]) /
        100;
      totalLandUsage +=
        sector_power_demand *
        electricityGenerationLandUseIntensity[sector]['land_use_intensity'];
    });
  });
  return totalLandUsage / dailyTransactions;
};

/**
 * Calculate PoW transaction water consumption
 * @param b0  linear regression model b0
 * @param b1  linear regression model b1
 * @param hashRate  current hash rate
 * @param dailyTransactions  total transactions last 24h
 * @param miningSharesFile  path to mining shares file, if undefined, the default
 * mining shares will be used instead.
 * @param defaultMiningShares  default mining shares for each country
 * @param electricityWaterIntensity  electricity water intensity in L/kWH for each country
 * @return water consumption for each transaction in litre (L)
 */
export const powWaterConsumption = (
  b0: number,
  b1: number,
  hashRate: number,
  dailyTransactions: number,
  miningSharesFile: string,
  defaultMiningShares: any,
  electricityWaterIntensity: any
): number => {
  // Get mining shares data
  const miningSharesData = getMiningSharesData(
    miningSharesFile,
    defaultMiningShares
  );

  const powerDemand = b0 + b1 * hashRate;
  const directWaterConsumption = powerDemand * 1.8;
  let indirectWaterConsumption = 0;
  // For each country in mining share data
  Object.keys(miningSharesData).forEach(country => {
    const miningShare = miningSharesData[country];
    const intensity =
      electricityWaterIntensity[country]['electricity_water_intensity'];
    indirectWaterConsumption += (miningShare * powerDemand * intensity) / 100;
  });

  return (
    (directWaterConsumption + indirectWaterConsumption) / dailyTransactions
  );
};
