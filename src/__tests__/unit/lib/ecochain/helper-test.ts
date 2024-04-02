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
      US: 37.84,
      CN: 21.11,
      KZ: 13.22,
      CA: 6.48,
      RU: 4.66,
      DE: 3.06,
      MY: 2.51,
      IE: 1.97,
      IR: 0.12,
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
