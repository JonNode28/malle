import { atom, RecoilState } from "recoil";

interface PropDataStateMeta {
  state: RecoilState<any>,
  deleted: boolean,
  default: any
}

const propDataStateMap: { [key: string]: PropDataStateMeta } = {};

export default {
  get: (storeId: string, defaultValue?: any) => {
    if(storeId === undefined) throw new Error('Store ID is required')
    let meta = propDataStateMap[storeId]
    if(meta) return meta.state

    if (defaultValue === undefined) {
      throw new Error(`Can't create Recoil state without a default value`)
    }
    console.log(`Creating state '${storeId}'`)
    propDataStateMap[storeId] = meta = {
      state: atom({
        key: storeId,
        default: defaultValue
      }),
      deleted: false,
      default: defaultValue
    }
    return meta.state
  },
  remove: (storeId: string) => {
    const meta = propDataStateMap[storeId]
    if(meta) meta.deleted = true
  }
}