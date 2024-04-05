//export type PluginParams = Record<string, any>;
export type PluginParams = {
  [key: string]: any;
};
export type ConfigParams = Record<string, any>;
export type EcoChainGlobalConfig = Record<string, any>;
export type PluginInterface = {
  execute: (
    inputs: PluginParams[],
    config?: ConfigParams
  ) => Promise<PluginParams[]>;
  metadata: {
    kind: string;
  };
  [key: string]: any;
};
