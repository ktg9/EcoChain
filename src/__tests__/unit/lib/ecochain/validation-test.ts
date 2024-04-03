import {
  validateInput,
  validateGlobalConfig,
} from '../../../../lib/ecochain/validation';
import {ERRORS} from '../../../../lib/ecochain/error';

describe('validateGlobalConfig', () => {
  const supportedBlockchains = ['btc', 'solana']; // Update with your supported blockchains

  it('throws MISSING_GLOBAL_CONFIG error when globalConfig is undefined', () => {
    expect(() => validateGlobalConfig(undefined, supportedBlockchains)).toThrow(
      ERRORS.MISSING_GLOBAL_CONFIG
    );
  });

  it('throws MISSING_BLOCKCHAIN_CONFIG error when blockchain is missing in globalConfig', () => {
    const globalConfig = {};
    expect(() =>
      validateGlobalConfig(globalConfig, supportedBlockchains)
    ).toThrow(ERRORS.MISSING_BLOCKCHAIN_CONFIG);
  });

  it('throws NOT_SUPPORTED_BLOCKCHAIN error when blockchain in globalConfig is not supported', () => {
    const globalConfig = {blockchain: 'ethereum'}; // Assuming 'ethereum' is not supported
    expect(() =>
      validateGlobalConfig(globalConfig, supportedBlockchains)
    ).toThrow(ERRORS.NOT_SUPPORTED_BLOCKCHAIN('ethereum'));
  });

  it('validation pass', () => {
    const globalConfig = {blockchain: 'btc'};
    expect(() =>
      validateGlobalConfig(globalConfig, supportedBlockchains)
    ).not.toThrow();
  });
});

describe('validateInput', () => {
  test('throws NOT_SUPPORTED_BLOCKCHAIN_TYPE error when blockchainType is neither "pow" nor "pos"', () => {
    const input = {};
    const blockchainType = 'invalidType';
    expect(() => validateInput(input, 0, blockchainType)).toThrow(
      ERRORS.NOT_SUPPORTED_BLOCKCHAIN_TYPE(blockchainType)
    );
  });

  describe('validateInput()', () => {
    it('pow - throws INVALID_INPUT error when "hash_rate" or "daily_transactions" is missing in input', () => {
      const blockchainType = 'pow';
      const input = {};
      expect(() => validateInput(input, 0, blockchainType)).toThrow(
        ERRORS.INVALID_INPUT(0, blockchainType)
      );
    });

    it('pow - validation pass', () => {
      const blockchainType = 'pow';
      const input = {hash_rate: 100, daily_transactions: 50};
      expect(() => validateInput(input, 0, blockchainType)).not.toThrow();
    });

    it('pos - throws INVALID_INPUT error when "gas_used" or "node_count" is missing in input', () => {
      const blockchainType = 'pos';
      const input = {};
      expect(() => validateInput(input, 0, blockchainType)).toThrow(
        ERRORS.INVALID_INPUT(0, blockchainType)
      );
    });

    it('pos - validation pass', () => {
      const blockchainType = 'pos';
      const input = {gas_used: 100, node_count: 50};
      expect(() => validateInput(input, 0, blockchainType)).not.toThrow();
    });
  });
});
