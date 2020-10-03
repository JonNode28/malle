import { NodeConfig } from "microo-core";
import { NodeDataHook } from "./NodeDataProvider";
import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";

/**
 * TODO: Split out into separate recoil package if successful
 * @param config
 * @param storeId
 * @param originalNodeData
 */
export const useRecoilNodeData: NodeDataHook = (
  instanceId: string | number,
  config: NodeConfig,
  originalNodeData: any,
  storeId?: string) => {
  if(!propDataStore.has(instanceId, config, storeId)){
    propDataStore.set(instanceId, config, originalNodeData, storeId)
  }
  const propDataState = storeId ?
    propDataStore.getByStoreId(storeId) :
    propDataStore.getByConfig(instanceId, config)

  return useRecoilState(propDataState);
}

export default useRecoilNodeData