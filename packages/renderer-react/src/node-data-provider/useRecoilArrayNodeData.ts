import { NodeConfig, PathSegment } from "microo-core";
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
 * @param path
 */
export const useRecoilArrayNodeData: ArrayNodeDataHook = (
  instanceId,
  config,
  ancestorConfigs,
  originalNodeData,
  committed = true,
  path,
) => {

  const originalChildIds = useMemo<Array<string>>(() => {
    return originalNodeData.map((item: any, i: number) => {
      return nanoid()
    })
  }, [])

  const [ childIds, setChildIds ] = useRecoilNodeData(instanceId, config, ancestorConfigs, originalChildIds, committed, path)



  return {
    childIds,
    removeItem: (index: number) => {
      const clone = [...childIds]
      clone.splice(index, 1)
      const childPath = [ ...path, index ]
      propDataStore.remove(childPath)
      setChildIds(clone)
    },
    commitItem: (index: number) => {
      const clone = [...childIds]
      clone.splice(index, 0, nanoid())
      const childPath = [ ...path, index ]
      propDataStore.commitItem(childPath)
      setChildIds(clone)
    }
  }
}

export default useRecoilArrayNodeData