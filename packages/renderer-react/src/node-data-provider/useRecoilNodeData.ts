import { NodeConfig } from "@graphter/core";
import { NodeDataHook } from "./NodeDataProvider";
import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";

/**
 * TODO: Split out into separate recoil package if successful
 * @param path
 * @param config
 * @param originalNodeData
 * @param committed
 */
export const useRecoilNodeData: NodeDataHook = (
  path,
  config,
  originalNodeData,
  committed = true,) => {

  let propDataState;
  if(!propDataStore.has(path)){
    propDataStore.set(path, config, committed, originalNodeData)
  }
  propDataState = propDataStore.get(path)

  return useRecoilState(propDataState)
}

export default useRecoilNodeData