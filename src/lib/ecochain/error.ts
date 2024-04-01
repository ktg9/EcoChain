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
