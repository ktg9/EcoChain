import * as fs from 'fs';

import {ERRORS} from './error';
import * as path from 'path';

/**
 * Load metadata from json file
 * @param metadataFilePath path to json metadata file
 */
export const loadMetadata = (metadataFilePath: string): any => {
  try {
    const fileData = fs.readFileSync(metadataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.log(error);
    throw new Error(ERRORS.LOADING_JSON_METADATA_FILE);
  }
};
/**
 * Get mining shares data
 * @param miningSharesFile the user input mining shares file path, if undefined, then defaultMiningShares is returned
 * @param defaultMiningShares default mining shares
 * @return mining shares
 */
export const getMiningSharesData = (
  miningSharesFile: any,
  defaultMiningShares: any
): any => {
  let miningSharesData: any;
  if (miningSharesFile === undefined) {
    miningSharesData = defaultMiningShares;
  } else {
    try {
      const fileData = fs.readFileSync(path.resolve(miningSharesFile), 'utf-8');
      miningSharesData = JSON.parse(fileData);
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.INVALID_MINING_SHARES_FILE(miningSharesFile));
    }
  }
  return miningSharesData;
};
