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

export const get = (
  instanceId: string | number,
  config: NodeConfig,
  originalValue: any,
  storeId?: string
): RecoilState<any> => {
  if(!has(instanceId, config, storeId)){
    console.log(`Creating state for ${storeId || config.id}`)
    set(instanceId, config, originalValue, storeId)
  }
  if (typeof storeId !== 'undefined') {
    const state = getByStoreId(storeId)
    if(!state) throw new Error('Empty state. Should never happen')
    return state
  }
  return getByConfig(instanceId, config)
}
export const getByConfig = (instanceId: string | number, config: NodeConfig) => {
  return getMeta(instanceId, config)?.state
}
export const getByStoreId = (storeId: string) => {
  if (!storeId) throw new Error('Store ID is required')
  let meta = propDataStoreStateMetaMap.get(storeId)
  if (!meta) return null
  return meta.state
}
export const set = (instanceId: string | number, config: NodeConfig, defaultValue?: any, storeId?: string) => {
  if (typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
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
  if (!instanceConfigStateMetaMap) {
    instanceConfigStateMetaMap = new Map<NodeConfig, PropDataStateMeta>()
    propDataInstanceConfigStateMetaMap.set(instanceId, instanceConfigStateMetaMap)
  }
  instanceConfigStateMetaMap.set(config, meta)
  if (storeId) {
    propDataStoreStateMetaMap.set(storeId, meta)
  }
}
export const has = (instanceId: string | number, config: NodeConfig, storeId?: string): boolean => {
  if (storeId) return propDataStoreStateMetaMap.has(storeId)
  const instance = propDataInstanceConfigStateMetaMap.get(instanceId)
  if (!instance) return false
  return instance.has(config)
}
export const remove = (storeId: string) => {
  const meta = propDataStoreStateMetaMap.get(storeId)
  if (meta) meta.deleted = true
}

export default {
  get,
  getByConfig,
  getByStoreId,
  set,
  has,
  remove,
}

function getMeta(instanceId: string | number, config: NodeConfig) {
  if (typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
  if (!config) throw new Error('config is required')
  const instanceConfigStateMeta = propDataInstanceConfigStateMetaMap.get(instanceId)
  if (!instanceConfigStateMeta) throw new Error(`Instance '${instanceId}' doesn't exist in store`)
  const meta = instanceConfigStateMeta.get(config)
  if (!meta) throw new Error(`Instance '${instanceId}' doesn't have state for '${config.id}'`)
  return meta
}