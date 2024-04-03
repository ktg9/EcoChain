import {PluginParams} from '../../../../lib/ecochain/types';
import {
  powCalculation,
  powWaterConsumption,
} from '../../../../lib/ecochain/pow';
import * as fs from 'fs';
import * as path from 'path';
import {ERRORS} from '../../../../lib/ecochain/error';

describe('pow.ts', () => {
  describe('powCalculation()', () => {
    it('Correct outputs calculation', () => {
      expect.assertions(1);

      const inputs: PluginParams[] = [
        {hash_rate: 576.04e18, total_transactions: 297442},
      ];

      const models: any[] = [
        {
          type: 'carbon',
          b0: 45854865.89077085,
          b1: 3.21680913e-13,
        },
        {
          type: 'ewaste',
          b0: 9302292.008423146,
          b1: 4.42885761e-14,
        },
        {
          type: 'fresh_water',
          b0: 90595506.70413834,
          b1: 6.35545318e-13,
        },
        {
          type: 'land',
          b0: 90595506.70413834,
          b1: 6.35545318e-13,
        },
      ];
      const defaultMiningShares = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'config',
            'bitcoin_mining_shares.json'
          ),
          'utf-8'
        )
      );
      const electricityWaterIntensity = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'config',
            'electricity_water_intensity.json'
          ),
          'utf-8'
        )
      );
      const electricityMixByCountries = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'config',
            'electricity_mix_by_countries.json'
          ),
          'utf-8'
        )
      );
      const electricityGenerationLandUseIntensity = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'config',
            'electricity_generation_land_use_intensity.json'
          ),
          'utf-8'
        )
      );

      const result = powCalculation(
        inputs,
        models,
        defaultMiningShares,
        electricityWaterIntensity,
        electricityMixByCountries,
        electricityGenerationLandUseIntensity
      );
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
      expect(result).toStrictEqual(expectedResult);
    });
  });
  describe('powWaterConsumption()', () => {
    it('Invalid mining shares files', () => {
      const miningSharesFile = path.resolve(__dirname, 'invalid.json');

      expect(() =>
        powWaterConsumption(0, 0, 0, 0, miningSharesFile, {}, {})
      ).toThrow(ERRORS.INVALID_MINING_SHARES_FILE(miningSharesFile));
    });
    it('Correct water consumption calculation', () => {
      expect.assertions(1);
      const miningSharesFile = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        'config',
        'bitcoin_mining_shares.json'
      );
      const b0 = 90595506.70413834;
      const b1 = 6.35545318e-13;
      const hashRate = 576.04e18;
      const totalTransactions = 297442;

      const defaultMiningShares = {};
      const electricityWaterIntensity = JSON.parse(
        fs.readFileSync(
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            '..',
            'config',
            'electricity_water_intensity.json'
          ),
          'utf-8'
        )
      );

      const result = powWaterConsumption(
        b0,
        b1,
        hashRate,
        totalTransactions,
        miningSharesFile,
        defaultMiningShares,
        electricityWaterIntensity
      );
      const expectedResult = 32618.398678432943;
      expect(result).toStrictEqual(expectedResult);
    });
  });
});