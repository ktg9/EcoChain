import {PluginParams} from '../../../../lib/ecochain/types';
import {posCalculation} from '../../../../lib/ecochain/pos';

describe('pos.ts', () => {
  describe('posCalculation()', () => {
    it('Correct emission calculation', () => {
      expect.assertions(1);

      const inputs: PluginParams[] = [{gas_used: 100000, node_count: 10000}];
      const models: [any] = [
        {
          b0: 10000,
          b1: 1e-10,
          type: 'carbon',
        },
      ];
      const result = posCalculation(inputs, models);
      const expectedResult = [
        {
          gas_used: 100000,
          node_count: 10000,
          carbon: 0.1,
        },
      ];
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
