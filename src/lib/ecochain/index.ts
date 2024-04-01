import {PluginParams} from './types';
import * as fs from 'fs';
import * as path from 'path';

import {ERRORS} from './error';
import {EcoChainGlobalConfig} from './types';
import {validateGlobalConfig} from './validation';
import {powCalculation} from './pow';
import {posCalculation} from './pos';

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
   * Load json metadata file.
   * This file contains config about which blockchains are supported and their models for calculation
   * different environmental impacts.
   * The file should locate in the same folder with source code file.
   */

  const loadMetadata = (metadataFilePath: string): any => {
    try {
      const fileData = fs.readFileSync(
        path.resolve(__dirname, '..', '..', '..', 'config', metadataFilePath),
        'utf-8'
      );
      return JSON.parse(fileData);
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.LOADING_JSON_METADATA_FILE);
    }
  };
  const blockchainConfig = loadMetadata('ecochain_metadata.json');
  const defaultBitcoinMiningShares = loadMetadata('bitcoin_mining_shares.json');
  const electricityWaterIntensity = loadMetadata(
    'electricity_water_intensity.json'
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
