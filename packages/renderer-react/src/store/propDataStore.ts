import { atom, RecoilState } from "recoil";

const propDataModelMap: { [key: string]: RecoilState<any> } = {};
export default {
  get: (modelId: string, jsonPointer: string, defaultValue?: any) => {
    const key = `${modelId}-${jsonPointer}-c2c87429-dabf-4ea0-b2e1-6e7a6262bc11`
    let propDataState = propDataModelMap[key]
    if(!propDataState){
      if(defaultValue === undefined) throw new Error(`Can't create Recoil state without a default value`)
      propDataModelMap[key] = propDataState = atom({
        key,
        default: defaultValue
      })
    }
    return propDataState
  }
}