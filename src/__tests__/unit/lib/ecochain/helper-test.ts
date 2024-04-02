import {loadMetadata} from '../../../../lib/ecochain/helper';
import * as path from 'path';
import {ERRORS} from '../../../../lib/ecochain/error';

describe('loadMetadata()', () => {
  it('valid metadata file path', () => {
    const filePath = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'config',
      'bitcoin_mining_shares.json'
    );
    const result = loadMetadata(filePath);
    expect(result).toStrictEqual({
      'United States': 37.84,
      China: 21.11,
      Kazakhstan: 13.22,
      Canada: 6.48,
      Russia: 4.66,
      Germany: 3.06,
      Malaysia: 2.51,
      Ireland: 1.97,
      Iran: 0.12,
      Unknown: 9.02,
    });
  });
  it('invalid metadata file path', () => {
    const filePath = path.resolve(__dirname, 'invalid.json');
    expect(() => loadMetadata(filePath)).toThrow(
      ERRORS.LOADING_JSON_METADATA_FILE
    );
  });
});
