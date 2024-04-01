import {PluginParams} from './types';
import {validateInput} from './validation';
import * as fs from 'fs';
import * as path from 'path';
import {ERRORS} from './error';

export const powCalculation = (
  inputs: PluginParams[],
  models: [any],
  defaultBitcoinMiningShares: any,
  electricityWaterIntensity: any
): PluginParams[] => {
  return inputs.map((input, index) => {
    validateInput(input, index, 'pow');
    // Calculate Proof-of-Work footprints
    const hashRate = input['hash_rate'];
    const totalTransactions = input['total_transactions'];
    const bitcoinMiningSharesFile = input['bitcoin_mining_shares_file'];
    const output: any = {};
    models.map(model => {
      const type = model['type'];
      const b0 = model['b0'];
      const b1 = model['b1'];
      if (type === 'fresh_water') {
        output[type] = calculateWaterConsumption(
          b0,
          b1,
          hashRate,
          totalTransactions,
          bitcoinMiningSharesFile,
          defaultBitcoinMiningShares,
          electricityWaterIntensity
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

const calculateWaterConsumption = (
  b0: number,
  b1: number,
  hashRate: number,
  totalTransactions: number,
  bitcoinMiningSharesFile: string,
  defaultBitcoinMiningShares: any,
  electricityWaterIntensity: any
): number => {
  const powerDemand = b0 + b1 * hashRate;
  const directWaterConsumption = powerDemand * 1.8;

  // Get mining shares data
  let miningSharesData: any;
  if (bitcoinMiningSharesFile === undefined) {
    miningSharesData = defaultBitcoinMiningShares;
  } else {
    try {
      const fileData = fs.readFileSync(
        path.resolve(bitcoinMiningSharesFile),
        'utf-8'
      );
      miningSharesData = JSON.parse(fileData);
    } catch (error) {
      console.log(error);
      throw new Error(
        ERRORS.INVALID_MINING_SHARES_FILE(bitcoinMiningSharesFile)
      );
    }
  }
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
