import { atom, RecoilState } from "recoil";

interface PropDataStateMeta {
  state: RecoilState<any>,
  deleted: boolean,
  default: any
}

const propDataStateMap: { [key: string]: PropDataStateMeta } = {};

export default {
  has: (modelId: string, jsonPointer: string): boolean => {
    const key = `${modelId}-${jsonPointer}-c2c87429-dabf-4ea0-b2e1-6e7a6262bc11`
    const meta = propDataStateMap[key]
    return !!meta && !meta.deleted
  },
  get: (modelId: string, jsonPointer: string, defaultValue?: any) => {
    const key = `${modelId}-${jsonPointer}-c2c87429-dabf-4ea0-b2e1-6e7a6262bc11`
    let meta = propDataStateMap[key]
    if (!meta) {
      if (defaultValue === undefined) {
        throw new Error(`Can't create Recoil state without a default value`)
      }
      propDataStateMap[key] = meta = {
        state: atom({
          key,
          default: defaultValue
        }),
        deleted: false,
        default: defaultValue
      }
    }
    return meta.state
  },
  remove: (modelId: string, jsonPointer: string) => {
    const key = `${modelId}-${jsonPointer}-c2c87429-dabf-4ea0-b2e1-6e7a6262bc11`
    const meta = propDataStateMap[key]
    if(meta) meta.deleted = true
  }
}