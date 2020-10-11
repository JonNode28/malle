import { NodeConfig } from "microo-core";
import { ArrayNodeDataHook } from "./NodeDataProvider";
import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import useRecoilNodeData from "./useRecoilNodeData";

/**
 * TODO: Split out into separate recoil package if successful
 * @param instanceId
 * @param config
 * @param ancestorConfigs
 * @param originalNodeData
 * @param committed
 * @param index
 */
export const useRecoilArrayNodeData: ArrayNodeDataHook = (
  instanceId,
  config,
  ancestorConfigs,
  originalNodeData,
  committed = true,
  index?
) => {

  const originalChildIds = useMemo<Array<string>>(() => {
    return originalNodeData.map((item: any, i: number) => {
      return nanoid()
    })
  }, [])

  const [ childIds, setChildIds ] = useRecoilNodeData(instanceId, config, ancestorConfigs, originalChildIds, committed, index)



  return {
    childIds,
    removeItem: (index: number) => {
      const clone = [...childIds]
      clone.splice(index, 1)
      propDataStore.removeItem(instanceId, config, index)
      setChildIds(clone)
    },
    commitItem: (index: number) => {
      const clone = [...childIds]
      clone.splice(index, 0, nanoid())
      propDataStore.commitItem(instanceId, config, index)
      setChildIds(clone)
    }
  }
}

export default useRecoilArrayNodeData