import {PluginParams} from './types';

import {EcoChainGlobalConfig} from './types';
import {validateGlobalConfig} from './validation';
import {powCalculation} from './pow';
import {posCalculation} from './pos';
import {loadMetadata} from './helper';
import * as path from 'path';

export const EcoChain = (
  globalConfig: EcoChainGlobalConfig
): {
  metadata: {kind: string};
  execute: (inputs: PluginParams[]) => PluginParams[];
} => {
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
  const supportedBlockchains = blockchainConfig['supported_blockchains'];

  /**
   * Calculate pow or pos environmental impacts
   */
  const execute = (inputs: PluginParams[]): PluginParams[] => {
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
        electricityWaterIntensity
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
