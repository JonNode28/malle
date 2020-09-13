import { atom, RecoilState, selector } from "recoil";
import { getPropertyJsonPointer } from "../util/model";
import propDataStore from "./propDataStore";
import ptr from "json-pointer";
import { ModelConfig } from "microo-core";
import { getItemId } from "../util/id";

const modelDataMap: { [key: string]: RecoilState<any> } = {};
export default {
  get: (modelConfig: ModelConfig, originalData: any) => {
    const key = `${modelConfig.id}-${getItemId(modelConfig.identityPath, originalData)}-c2c87429-dabf-4ea0-b2e1-6e7a6262bc11`
    let modelDataSelector = modelDataMap[key]
    if(modelDataSelector) return modelDataSelector

    modelDataMap[key] = modelDataSelector = selector<any>({
      key: 'ModelDataSelector',
      get: ({ get }) => {
        console.info('Getting entire model data');
        return modelConfig.properties.reduce((a, c): any => {
          const propJsonPointer = getPropertyJsonPointer(c);
          const defaultValue = ptr.has(originalData, propJsonPointer) ? ptr.get(originalData, propJsonPointer) : null
          const state = propDataStore.get(modelConfig.id, propJsonPointer, defaultValue)
          if(!state) return;
          ptr.set(a, propJsonPointer, get(state))
          return a
        }, {})
      },
      set: ({ get, set }, newValue) => {
        console.info('Setting entire model data');
        modelConfig.properties.forEach(propertyConfig => {
          const propJsonPointer = getPropertyJsonPointer(propertyConfig);
          const state = propDataStore.get(modelConfig.id, propJsonPointer)
          if(!state) return;
          const newPropValue = ptr.has(newValue, propJsonPointer) ? ptr.get(newValue, propJsonPointer) : null
          set(state, newPropValue); // TODO: Optimise with a prev/next equality check
        });
      }
    });

    return modelDataSelector
  }
}