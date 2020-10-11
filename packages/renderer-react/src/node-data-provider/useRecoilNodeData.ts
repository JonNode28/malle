import { NodeConfig } from "microo-core";
import { NodeDataHook } from "./NodeDataProvider";
import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";

/**
 * TODO: Split out into separate recoil package if successful
 * @param instanceId
 * @param config
 * @param ancestorConfigs
 * @param originalNodeData
 * @param committed
 * @param index
 */
export const useRecoilNodeData: NodeDataHook = (
  instanceId,
  config,
  ancestorConfigs,
  originalNodeData,
  committed = true,
  index?) => {

  let propDataState;
  if(index === undefined){
    if(!propDataStore.has(instanceId, config)){
      propDataStore.set(instanceId, config, committed, originalNodeData)
    }
    propDataState = propDataStore.get(instanceId, config)
  } else {
    if(!ancestorConfigs || !ancestorConfigs.length) throw new Error('Parent config is required when working with array data')
    const parentConfig = ancestorConfigs[ancestorConfigs.length - 1]
    if(!propDataStore.has(instanceId, parentConfig, index)){
      propDataStore.setItem(instanceId, parentConfig, config, committed, index, originalNodeData)
    }
    propDataState = propDataStore.get(instanceId, parentConfig, index)
  }
  return useRecoilState(propDataState)
}

export default useRecoilNodeData