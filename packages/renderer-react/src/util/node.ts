import { NodeConfig } from "microo-core";

export function createDefault(config: NodeConfig, fallbackValue: any = undefined): any{
  const defaultType = typeof config.default;
  if(defaultType === 'undefined'){
    if(typeof fallbackValue === 'undefined'){
      throw new Error(`A default value is required by the '${config.id}' model`)
    }
    return fallbackValue
  } else if(defaultType === 'function'){
    return config.default()
  }
  return config.default
}