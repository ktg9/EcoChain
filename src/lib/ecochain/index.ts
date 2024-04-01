import {PluginParams} from './types';
import * as fs from 'fs';
import * as path from 'path';
import {z} from 'zod';

// Errors
export const ERRORS = {
  LOADING_JSON_METADATA_FILE:
    'Error while loading json metadata file, it should locate in folder config.',
  NOT_SUPPORTED_BLOCKCHAIN: (blockchain: string) =>
    `Blockchain '${blockchain}' is not supported`,
  MISSING_SUPPORTED_BLOCKCHAIN: 'Missing supported blockchains in config file.',
  MISSING_GLOBAL_CONFIG: 'Missing global config.',
  MISSING_BLOCKCHAIN_CONFIG: 'Missing blockchain param in global config.',
  INVALID_INPUT: (index: number, blockchainType: string) => {
    if (blockchainType === 'pow') {
      return `Invalid input index ${index}, POW blockchain requires hash_rate and total_transactions input.`;
    } else {
      return `Invalid input index ${index}, POS blockchain requires gas_used and node_count input.`;
    }
  },
  NOT_SUPPORTED_BLOCKCHAIN_TYPE: (blockchainType: string) =>
    `Blockchain type ${blockchainType} is not supported.`,
  INVALID_MINING_SHARES_FILE: (filePath: string) =>
    `Invalid mining shares file ${filePath}`,
};

type YourGlobalConfig = Record<string, any>;
export const EcoChain = (
  globalConfig: YourGlobalConfig
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
        path.resolve(__dirname, 'config', metadataFilePath),
        'utf-8'
      );
      return JSON.parse(fileData);
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.LOADING_JSON_METADATA_FILE);
    }
  };
  const blockchainConfig = loadMetadata('ecochain_metadata.json');
  const bitoinMiningShares = loadMetadata('bitcoin_mining_shares.json');
  const electricityWaterIntensity = loadMetadata(
    'electricity_water_intensity.json'
  );
  const supportedBlockchains = blockchainConfig['supported_blockchains'];

  /**
   * Validate global config
   */
  const validateGlobalConfig = () => {
    if (globalConfig === undefined) {
      throw new Error(ERRORS.MISSING_GLOBAL_CONFIG);
    }
    const schema = z.object({
      blockchain: z.enum(supportedBlockchains),
    });
    try {
      schema.parse(globalConfig);
    } catch (error) {
      console.log(error);
      const blockchain = globalConfig['blockchain'];
      if (blockchain === undefined) {
        throw new Error(ERRORS.MISSING_BLOCKCHAIN_CONFIG);
      } else {
        throw new Error(ERRORS.NOT_SUPPORTED_BLOCKCHAIN(blockchain));
      }
    }
  };

  /**
   * Validate input parameters
   */

  const validateInput = (
    input: PluginParams,
    index: number,
    blockchainType: string
  ) => {
    let schema;
    if (blockchainType === 'pow') {
      schema = z.object({
        hash_rate: z.number({
          required_error: `required in input[${index}]`,
        }),
        total_transactions: z.number({
          required_error: `required in input[${index}]`,
        }),
      });
    } else if (blockchainType === 'pos') {
      schema = z.object({
        gas_used: z.number({
          required_error: `required in input[${index}]`,
        }),
        node_count: z.number({
          required_error: `required in input[${index}]`,
        }),
      });
    } else {
      throw new Error(ERRORS.NOT_SUPPORTED_BLOCKCHAIN_TYPE(blockchainType));
    }
    try {
      schema.parse(input);
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.INVALID_INPUT(index, blockchainType));
    }
  };

  /**
   * Execute's strategy description here.
   */
  const execute = (inputs: PluginParams[]): PluginParams[] => {
    validateGlobalConfig();
    const blockchain = globalConfig['blockchain'];
    const blockchainType =
      blockchainConfig['blockchain_config'][blockchain]['type'];
    const models = blockchainConfig['blockchain_config'][blockchain]['models'];

    let outputs: PluginParams[];
    if (blockchainType === 'pow') {
      outputs = powCalculation(inputs, models);
    } else {
      outputs = posCalculation(inputs, models);
    }

    return outputs;
  };

  const powCalculation = (
    inputs: PluginParams[],
    models: [any]
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
            bitcoinMiningSharesFile
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
    bitcoinMiningSharesFile: string
  ): number => {
    const powerDemand = b0 + b1 * hashRate;
    const directWaterConsumption = powerDemand * 1.8;

    // Get mining shares data
    let miningSharesData: any;
    if (bitcoinMiningSharesFile === undefined) {
      miningSharesData = bitoinMiningShares;
    } else {
      try {
        const fileData = fs.readFileSync(
          path.resolve(__dirname, bitcoinMiningSharesFile),
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

  const posCalculation = (
    inputs: PluginParams[],
    models: [any]
  ): PluginParams[] => {
    return inputs.map((input, index) => {
      validateInput(input, index, 'pos');
      // Calculate Proof-of-Stake footprints
      const gasUsed = input['gas_used'];
      const nodeCount = input['node_count'];

      const output: any = {};
      models.map(model => {
        const type = model['type'];
        const b1 = model['b1'];
        output[type] = b1 * gasUsed * nodeCount;
      });
      return {
        ...input,
        ...output,
      };
    });
  };

  return {
    metadata,
    execute,
  };
};
