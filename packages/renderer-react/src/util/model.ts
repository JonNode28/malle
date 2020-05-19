import { ModelConfig } from "microo-core";

export function createNewInstance(config: ModelConfig): any{
  return config.properties.reduce<any>((a, c) => {
    const defaultType = typeof c.default;
    if(defaultType !== 'undefined'){
      a[c.id] = defaultType === 'function' ? c.default() : c.default;
    }
    return a;
  }, {});
}