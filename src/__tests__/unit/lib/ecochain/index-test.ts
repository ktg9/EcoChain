import {EcoChain} from '../../../../lib';
import {expect} from '@jest/globals';

describe('Execute()', () => {
  it('pow calculation', () => {
    expect.assertions(1);
    const globalConfig = {
      blockchain: 'btc',
    };
    const ecoChain = EcoChain(globalConfig);
    const expectedResult = [
      {
        hash_rate: 576040000000000000000,
        total_transactions: 297442,
        carbon: 777.1462638608228,
        ewaste: 117.04562027241327,
        fresh_water: 32618.398678432943,
        land: 39.68218341744669,
      },
    ];

    const result = ecoChain.execute([
      {
        hash_rate: 576.04e18,
        total_transactions: 297442,
      },
    ]);
    expect(result).toStrictEqual(expectedResult);
  });
  it('pos calculation', () => {
    const globalConfig = {
      blockchain: 'sol',
    };
    const ecoChain = EcoChain(globalConfig);
    const expectedResult = [
      {
        gas_used: 80000,
        node_count: 3000,
        carbon: 0.002438937072,
      },
    ];
    const result = ecoChain.execute([
      {
        gas_used: 80000,
        node_count: 3000,
      },
    ]);
    expect(result).toStrictEqual(expectedResult);
  });
});
