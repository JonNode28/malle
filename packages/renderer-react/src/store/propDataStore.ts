import { atom, RecoilState } from "recoil";
import { NodeConfig } from "microo-core";
import { nanoid } from "nanoid";

interface PropDataStateMeta {
  state: RecoilState<any>,
  deleted: boolean,
  config: NodeConfig,
  default: any
}

const propDataStoreStateMetaMap: Map<string, PropDataStateMeta>
  = new Map<string, PropDataStateMeta>()
const propDataInstanceConfigStateMetaMap: Map<string | number, Map<NodeConfig, PropDataStateMeta>>
  = new Map<string | number, Map<NodeConfig, PropDataStateMeta>>()

export default {
  getByConfig: (instanceId: string | number, config: NodeConfig) => {
    return getMeta(instanceId, config)?.state
  },
  getByStoreId: (storeId: string) => {
    if(!storeId) throw new Error('Store ID is required')
    let meta = propDataStoreStateMetaMap.get(storeId)
    if(!meta) throw new Error('No prop state in store')
    return meta.state
  },
  set: (instanceId: string | number, config: NodeConfig, defaultValue?: any, storeId?: string) => {
    if(typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
    const meta = {
      state: atom({
        key: storeId || nanoid(),
        default: defaultValue
      }),
      deleted: false,
      config,
      default: defaultValue
    }
    let instanceConfigStateMetaMap = propDataInstanceConfigStateMetaMap.get(instanceId)
    if(!instanceConfigStateMetaMap){
      instanceConfigStateMetaMap = new Map<NodeConfig, PropDataStateMeta>()
      propDataInstanceConfigStateMetaMap.set(instanceId, instanceConfigStateMetaMap)
    }
    instanceConfigStateMetaMap.set(config, meta)
    if(storeId){
      propDataStoreStateMetaMap.set(storeId, meta)
    }
  },
  has: (instanceId: string | number, config: NodeConfig, storeId?: string): boolean => {
    if(storeId) return propDataStoreStateMetaMap.has(storeId)
    const instance = propDataInstanceConfigStateMetaMap.get(instanceId)
    if(!instance) return false
    return instance.has(config)
  },
  getConfigByStoreId: (storeId: string) => {
    if(!storeId) throw new Error('Store ID is required')
    return propDataStoreStateMetaMap.get(storeId)?.config || null
  },
  remove: (storeId: string) => {
    const meta = propDataStoreStateMetaMap.get(storeId)
    if(meta) meta.deleted = true
  }
}

function getMeta(instanceId: string | number, config: NodeConfig){
  if(typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
  if(!config) throw new Error('config is required')
  const instanceConfigStateMeta = propDataInstanceConfigStateMetaMap.get(instanceId)
  if(!instanceConfigStateMeta) throw new Error(`Instance '${instanceId}' doesn't exist in store`)
  const meta = instanceConfigStateMeta.get(config)
  if(!meta) throw new Error(`Instance '${instanceId}' doesn't have state for '${config.id}'`)
  return meta
}