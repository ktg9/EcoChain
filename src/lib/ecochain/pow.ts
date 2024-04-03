import {PluginParams} from './types';
import {validateInput} from './validation';
import * as fs from 'fs';
import * as path from 'path';
import {ERRORS} from './error';

/**
 * Calculate Proof-of-work blockchain environmental impacts
 * @param inputs -> received from yml file
 * @param models -> models list, models include parameters for calculation. E.g, if it's linear regression, models include
 * b0 and b1
 * @param defaulMiningShares -> default mining shares for each country
 * @param electricityWaterIntensity -> electricity water intensity in L/kWH for each country
 * @param electricityMixByCountries -> electricity mix by countries
 * @param electricityGenerationLandUseIntensity -> electricity generations land use intensity
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
    const totalTransactions = input['daily_transactions'];
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
          totalTransactions,
          miningSharesFile,
          defaulMiningShares,
          electricityWaterIntensity
        );
      } else if (type === 'land') {
        output[type] = powLandUsage(
          b0,
          b1,
          hashRate,
          totalTransactions,
          miningSharesFile,
          defaulMiningShares,
          electricityMixByCountries,
          electricityGenerationLandUseIntensity
        );
      } else {
        output[type] = (b0 + b1 * hashRate) / totalTransactions;
      }
    });
    return {
      ...input,
      ...output,
    };
  });
};

export const powLandUsage = (
  b0: number,
  b1: number,
  hashRate: number,
  totalTransactions: number,
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
  Object.keys(miningSharesData).forEach(country => {
    if (electricityMixByCountries[country] === undefined) {
      return;
    }
    const miningShare = miningSharesData[country];
    const country_power_demand = (powerDemand * miningShare) / 100;
    // Loop through each electricity generation technology (biomass, hydro,..)
    Object.keys(electricityMixByCountries[country]).forEach(sector => {
      const sector_power_demand =
        (country_power_demand * electricityMixByCountries[country][sector]) /
        100;
      totalLandUsage +=
        sector_power_demand *
        electricityGenerationLandUseIntensity[sector]['land_use_intensity'];
    });
  });
  return totalLandUsage / totalTransactions;
};
export const getMiningSharesData = (
  miningSharesFile: any,
  defaultMiningShares: any
): any => {
  let miningSharesData: any;
  if (miningSharesFile === undefined) {
    miningSharesData = defaultMiningShares;
  } else {
    try {
      const fileData = fs.readFileSync(path.resolve(miningSharesFile), 'utf-8');
      miningSharesData = JSON.parse(fileData);
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.INVALID_MINING_SHARES_FILE(miningSharesFile));
    }
  }
  return miningSharesData;
};
/**
 * @param b0 -> linear regression model b0
 * @param b1 -> linear regression model b1
 * @param hashRate -> current hash rate
 * @param totalTransactions -> total transactions last 24h
 * @param miningSharesFile -> path to mining shares file, if undefined, the default
 * mining shares will be used instead.
 * @param defaultMiningShares -> default mining shares for each country
 * @param electricityWaterIntensity -> electricity water intensity in L/kWH for each country
 * @return water consumption for each transaction in litre (L)
 */
export const powWaterConsumption = (
  b0: number,
  b1: number,
  hashRate: number,
  totalTransactions: number,
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
  Object.keys(miningSharesData).forEach(key => {
    const miningShare = miningSharesData[key];
    const intensity =
      electricityWaterIntensity[key]['electricity_water_intensity'];
    indirectWaterConsumption += (miningShare * powerDemand * intensity) / 100;
  });

  return (
    (directWaterConsumption + indirectWaterConsumption) / totalTransactions
  );
};
