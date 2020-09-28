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
  config: NodeConfig,
  storeId: string,
  originalNodeData: any) => {
  const propDataState = propDataStore.get('GETTHEINSTANCEID!', storeId, originalNodeData)

  return useRecoilState(propDataState);
}

export default useRecoilNodeData