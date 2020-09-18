import { NodeConfig } from "microo-core";

export function createDefault(config: NodeConfig): any{
  const defaultType = typeof config.default;
  if(defaultType !== 'undefined'){
    return defaultType ==='function' ? config.default() : config.default;
  }

  if(config.children && config.children.length){
    return config.children.reduce<any>((a, c) => {
      const defaultValue = createDefault(c)
      if(defaultValue !== undefined) a[c.id] = defaultValue
      return a;
    }, {});
  }
}