import { RecoilState, selector, useRecoilState } from "recoil";
import { getPropertyJsonPointer, getPropertyState } from "../util/model";
import { ModelConfig, PropertyConfig } from "microo-core";
import ptr from 'json-pointer';

interface RecoilPropertyDataProviderProps {
  modelConfig: ModelConfig
  propertyConfig: PropertyConfig
  propertyStateMap: {
    [jsonPointer: string]: RecoilState<any>;
  }
  children: (props: ChildFunctionProps) => any
}
interface ChildFunctionProps {
  propData: any
  modelData: any
  setPropDataValue: (value: any) => void
  setModelDataValue: (value: any) => void
}
export default function RecoilPropertyDataProvider({ modelConfig, propertyConfig, propertyStateMap, children }: RecoilPropertyDataProviderProps){
  if(typeof children !== 'function') throw new Error(`<RecoilPropDataProvider /> must be passed a function child`);

  const [ propData, setPropData ] = useRecoilState(getPropertyState(propertyStateMap, propertyConfig));

  const modelDataSelector = selector<any>({
    key: 'ModelDataSelector',
    get: ({ get }) => {
      console.info('Getting entire model data');
      return modelConfig.properties.reduce((a, c): any => {
        const jsonPointer = getPropertyJsonPointer(c);
        const state = propertyStateMap[jsonPointer];
        if(!state) return;
        ptr.set(a, jsonPointer, get(state))
      }, {})
    },
    set: ({ get, set }, newValue) => {
      console.info('Setting entire model data');
      modelConfig.properties.forEach(propertyConfig => {
        const jsonPointer = getPropertyJsonPointer(propertyConfig);
        const state = propertyStateMap[jsonPointer];
        if(!state) return;
        set(state, ptr.get(newValue, jsonPointer)); // TODO: Optimise with a prev/next equality check
      });
    }
  });

  const [ modelData, setModelData ] = useRecoilState<any>(modelDataSelector);

  return children({ propData: propData, modelData: modelData, setPropDataValue: setPropData, setModelDataValue: setModelData });
}