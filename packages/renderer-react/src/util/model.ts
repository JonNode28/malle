import { ModelConfig, PropertyConfig } from "microo-core";
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

export function getPropStateMap(config: ModelConfig, data: any): { [ jsonPointer: string ]: RecoilState<any> } {
  return config.properties.reduce((a: { [ jsonPointer: string ]: RecoilState<any> }, c: PropertyConfig ) => {
    const propJsonPointer = getPropertyJsonPointer(c);
    let defaultVal;
    if(data){
      defaultVal = ptr.get(data, propJsonPointer);
    } else {
      defaultVal = typeof c.default === 'function' ? c.default() : c.default
    }
    a[propJsonPointer] = atom({
      key: `property-state-${propJsonPointer}`,
      default: defaultVal
    })
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

export function getPropertyState(
  propertyStateMap: { [ jsonPointer: string ]: RecoilState<any> },
  propertyConfig: PropertyConfig
): RecoilState<any> {
  if(!propertyConfig) throw Error(`propertyConfig argument is required`);
  const propJsonPointer = getPropertyJsonPointer(propertyConfig);
  const propState = propertyStateMap[propJsonPointer];
  if(propState === undefined) throw new Error(`Couldn't find state for prop ${propJsonPointer}`);
  return propState;
}