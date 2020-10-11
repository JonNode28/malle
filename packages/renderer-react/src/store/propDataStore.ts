import { atom, RecoilState } from "recoil";
import { NodeConfig } from "microo-core";
import { nanoid } from "nanoid";

interface PropDataStateMeta {
  state: RecoilState<any>,
  deleted: boolean,
  committed: boolean,
  config: NodeConfig,
  default: any
}

interface Node {
  meta: PropDataStateMeta | null,
  children: Array<PropDataStateMeta> | null
}

const propDataInstanceConfigStateMetaMap: Map<string | number, Map<NodeConfig, Node>>
  = new Map<string | number, Map<NodeConfig, Node>>()

export const get = (
  instanceId: string | number,
  config: NodeConfig,
  index?: number
): RecoilState<any> => {
  if(!has(instanceId, config, index)) throw new Error('Missing state')
  const configStateMetaNode = getConfigStateMeta(instanceId, config)
  if(!configStateMetaNode) throw new Error('Should never happen')
  if(index === undefined){
    if(!configStateMetaNode.meta) throw new Error('No meta')
    return configStateMetaNode.meta.state
  } else {
    if(!configStateMetaNode.children || !configStateMetaNode.children.length) throw new Error('No children')
    console.log(`Get ${instanceId}/${config.id}/[${index}]`)
    return configStateMetaNode.children[index].state
  }
}

export const getAll = (
  instanceId: string | number,
  config: NodeConfig
): Array<RecoilState<any>> => {
  if(!has(instanceId, config)) throw Error(`No state found for ${instanceId}/${config.id}`)
  const configStateMetaNode = getConfigStateMeta(instanceId, config)
  if(!configStateMetaNode || !configStateMetaNode.children || !configStateMetaNode.children.length) throw new Error('No children')
  return configStateMetaNode.children
    .filter(meta => meta.committed)
    .map(meta => meta.state)
}

export const set = (
  instanceId: string | number,
  config: NodeConfig,
  committed: boolean,
  originalValue?: any,
) => {
  if (typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
  const meta = {
    state: atom({
      key: nanoid(),
      default: originalValue
    }),
    deleted: false,
    committed,
    config,
    default: originalValue
  }
  let configStateMeta = ensureGetConfigStateMetaNode(instanceId, config)
  configStateMeta.meta = meta
}
export const setItem = (
  instanceId: string | number,
  parentConfig: NodeConfig,
  itemConfig: NodeConfig,
  committed: boolean,
  index?: number,
  originalValue?: any,
) => {
  if (typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
  console.log(`Set ${instanceId}/${parentConfig.id}/[${index}] = ${originalValue} (committed: ${committed})`)
  const meta = {
    state: atom({
      key: nanoid(),
      default: originalValue
    }),
    deleted: false,
    committed,
    config: itemConfig,
    default: originalValue
  }
  if(!has(instanceId, parentConfig)) throw new Error('No meta. Array should be set using set() before child operations are performed')
  let parentConfigStateMetaNode = ensureGetConfigStateMetaNode(instanceId, parentConfig)
  if(!parentConfigStateMetaNode.children) parentConfigStateMetaNode.children = []
  parentConfigStateMetaNode.children[index || parentConfigStateMetaNode.children.length] = meta
}

export const commitItem = (
  instanceId: string | number,
  parentConfig: NodeConfig,
  index: number
) => {
  if (typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
  console.log(`Committing ${instanceId}/${parentConfig.id}/[${index}]`)
  if(!has(instanceId, parentConfig)) throw new Error('No meta. Array should be set using set() before child operations are performed')
  let parentConfigStateMetaNode = ensureGetConfigStateMetaNode(instanceId, parentConfig)
  if(!parentConfigStateMetaNode.children) throw new Error('No children')
  if(!parentConfigStateMetaNode.children[index]) throw new Error(`No child at ${index} to commit`)
  parentConfigStateMetaNode.children[index].committed = true
}

export const has = (instanceId: string | number, config: NodeConfig, index?: number): boolean => {
  let instanceConfigStateMeta = propDataInstanceConfigStateMetaMap.get(instanceId)
  if (!instanceConfigStateMeta) return false
  let configStateMeta = instanceConfigStateMeta.get(config)
  if(!configStateMeta) return false
  if(index === undefined){
    return !!configStateMeta.meta
  } else {
    return !!(configStateMeta.children && configStateMeta.children[index])
  }
}

export const removeItem = (instanceId: string | number, parentConfig: NodeConfig, index: number) => {
  if (typeof instanceId === 'undefined' || instanceId === null) throw new Error('Instance ID is required')
  if(!parentConfig) throw new Error('Parent config is required')
  let configStateMeta = ensureGetConfigStateMetaNode(instanceId, parentConfig)
  if(!configStateMeta.children) return
  configStateMeta.children.splice(index, 1)
}

const getConfigStateMeta = (instanceId: string | number, config: NodeConfig) => {
  const instanceConfigStateMeta = propDataInstanceConfigStateMetaMap.get(instanceId)
  if(!instanceConfigStateMeta) return null
  const configStateMeta = instanceConfigStateMeta.get(config)
  if(configStateMeta === undefined) return null
  return configStateMeta
}

const ensureGetConfigStateMetaNode = (instanceId: string | number, config: NodeConfig) => {
  let instanceConfigStateMeta = propDataInstanceConfigStateMetaMap.get(instanceId)
  if (!instanceConfigStateMeta) {
    instanceConfigStateMeta = new Map<NodeConfig, Node>()
    propDataInstanceConfigStateMetaMap.set(instanceId, instanceConfigStateMeta)
  }
  let configStateMeta = instanceConfigStateMeta.get(config)
  if(!configStateMeta){
    configStateMeta = {
      meta: null,
      children: []
    }
    instanceConfigStateMeta.set(config, configStateMeta)
  }
  return configStateMeta
}

export default {
  get,
  getAll,
  set,
  setItem,
  commitItem,
  has,
  removeItem
}