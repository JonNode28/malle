import { NodeConfig } from "microo-core";
import { NodeDataHook } from "./NodeDataProvider";
import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";

/**
 * TODO: Split out into separate recoil package if successful
 * @param instanceId
 * @param config
 * @param storeId
 * @param originalNodeData
 */
export const useRecoilNodeData: NodeDataHook = (
  instanceId: string | number,
  config: NodeConfig,
  originalNodeData: any,
  storeId?: string) => {

  const propDataState = propDataStore.get(instanceId, config, originalNodeData, storeId)

  return useRecoilState(propDataState)
}

export default useRecoilNodeData