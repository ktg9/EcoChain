import {PluginParams} from './types';

import {EcoChainGlobalConfig, PluginInterface} from './types';
import {validateGlobalConfig} from './validation';
import {powCalculation} from './pow';
import {posCalculation} from './pos';
import {loadMetadata} from './helper';
import * as path from 'path';

export const EcoChain = (
  globalConfig: EcoChainGlobalConfig
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Load config data
   * - blockchainConfig: contains config about which blockchains are supported and their models for calculation
   * different environmental impacts.
   * - defaultBitcoinMiningShares: contain default bitcoin mining shares by countries
   * - electricityWaterIntensity: electricity water intensity by countries in L/kWh
   * - supportedBlockchains: supported blockchains, used to validate user input
   * - electricityMixByCountries: electricity mix of countries
   * - electricityGenerationLandUseIntensity: land use intensity in m2/year of electricity generation technologies
   */
  const blockchainConfig = loadMetadata(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'config',
      'ecochain_metadata.json'
    )
  );
  const defaultBitcoinMiningShares = loadMetadata(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'config',
      'bitcoin_mining_shares.json'
    )
  );
  const electricityWaterIntensity = loadMetadata(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'config',
      'electricity_water_intensity.json'
    )
  );
  const electricityMixByCountries = loadMetadata(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'config',
      'electricity_mix_by_countries.json'
    )
  );
  const electricityGenerationLandUseIntensity = loadMetadata(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'config',
      'electricity_generation_land_use_intensity.json'
    )
  );
  const supportedBlockchains = blockchainConfig['supported_blockchains'];

  /**
   * Calculate pow or pos environmental impacts
   */
  const execute = async (inputs: PluginParams[]): Promise<PluginParams[]> => {
    validateGlobalConfig(globalConfig, supportedBlockchains);
    const blockchain = globalConfig['blockchain'];
    const blockchainType =
      blockchainConfig['blockchain_config'][blockchain]['type'];
    const models = blockchainConfig['blockchain_config'][blockchain]['models'];

    let outputs: PluginParams[];
    if (blockchainType === 'pow') {
      outputs = powCalculation(
        inputs,
        models,
        defaultBitcoinMiningShares,
        electricityWaterIntensity,
        electricityMixByCountries,
        electricityGenerationLandUseIntensity
      );
    } else {
      outputs = posCalculation(inputs, models);
    }

    return outputs;
  };

  return {
    metadata,
    execute,
  };
};
