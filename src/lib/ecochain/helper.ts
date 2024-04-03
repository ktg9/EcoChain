import * as fs from 'fs';

import {ERRORS} from './error';

export const loadMetadata = (metadataFilePath: string): any => {
  try {
    const fileData = fs.readFileSync(metadataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.log(error);
    throw new Error(ERRORS.LOADING_JSON_METADATA_FILE);
  }
};