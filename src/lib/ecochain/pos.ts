import {PluginParams} from './types';
import {validateInput} from './validation';

/**
 * Calculate Proof-of-work blockchain environmental impacts
 * @param inputs -> received from yml file
 * @param models -> models list, models include parameters for calculation. E.g, if it's linear regression, models include
 * b0 and b1
 * @return PluginParams
 */
export const posCalculation = (
  inputs: PluginParams[],
  models: [any]
): PluginParams[] => {
  return inputs.map((input, index) => {
    validateInput(input, index, 'pos');
    // Calculate Proof-of-Stake footprints
    const gasUsed = input['gas_used'];
    const nodeCount = input['node_count'];

    const output: any = {};
    models.map(model => {
      const type = model['type'];
      const b1 = model['b1'];
      output[type] = b1 * gasUsed * nodeCount;
    });
    return {
      ...input,
      ...output,
    };
  });
};
