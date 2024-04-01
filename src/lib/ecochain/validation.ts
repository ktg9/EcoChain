import {ERRORS} from './error';
import {z} from 'zod';
import {EcoChainGlobalConfig, PluginParams} from './types';

/**
 * Validate global config
 * @param globalConfig
 * @param supportedBlockchains -> list of supported blockchain (btc,solana,...)
 */
export const validateGlobalConfig = (
  globalConfig: EcoChainGlobalConfig,
  supportedBlockchains: any
) => {
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
 * Validate inputs
 * @param input
 * @param index
 * @param blockchainType -> pow or pos
 */
export const validateInput = (
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
