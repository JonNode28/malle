import { ModelConfig, NodeConfig, PropertyConfig } from "microo-core";
import { atom, RecoilState, useSetRecoilState } from "recoil";
import ptr from 'json-pointer';

export function createNewInstance(config: ModelConfig): any{
  return config.properties.reduce<any>((a, c) => {
    const defaultType = typeof c.default;
    if(defaultType !== 'undefined'){
      a[c.id] = defaultType === 'function' ? c.default() : c.default;
    }
    return a;
  }, {});
}

export function createNewInstanceFromNodeConfig(config: NodeConfig): any{
  return config.children.reduce<any>((a, c) => {
    const defaultType = typeof c.default;
    if(defaultType !== 'undefined'){
      a[c.id] = defaultType === 'function' ? c.default() : c.default;
    }
    return a;
  }, {});
}

export function propStateMapToData(propStateMap: { [ jsonPointer: string ]: RecoilState<any> }): any {
  const data = {};
  Object.entries(propStateMap).forEach(([ jsonPointer, state ]) => {
    ptr.set(data, jsonPointer, state);
  });
}

export function getPropertyJsonPointer(config: PropertyConfig){
  return `/${config.id}`;
}