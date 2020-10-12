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
 * @param path
 */
export const useRecoilNodeData: NodeDataHook = (
  instanceId,
  config,
  ancestorConfigs,
  originalNodeData,
  committed = true,
  path,) => {

  let propDataState;
  if(!propDataStore.has(path)){
    propDataStore.set(path, config, committed, originalNodeData)
  }
  propDataState = propDataStore.get(path)

  return useRecoilState(propDataState)
}

export default useRecoilNodeData