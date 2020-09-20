import { NodeConfig } from "microo-core";

export function createDefault(config: NodeConfig, fallbackValue: any): any{
  const defaultType = typeof config.default;
  switch(defaultType){
    case 'undefined': return fallbackValue
    case 'function': return config.default()
    default: return config.default
  }
}