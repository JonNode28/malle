import React, { createContext, useContext, useMemo } from 'react';
import { NodeConfig } from "microo-core";
import { nanoid } from "nanoid";

interface DataProviderProps {
  instanceId: string | number,
  nodeDataHook: NodeDataHook,
  children: any
}

export interface NodeDataHook {
  (
    instanceId: string | number,
    config: NodeConfig,
    originalNodeData: any,
    storeId?: string,
  ): [ any, (value: any) => void ]
}

const Context = createContext<{ instanceId: string | number, nodeDataHook: NodeDataHook } | null>(null);

export function useNodeData<D>(
  config: NodeConfig, 
  originalNodeData: D,
  storeId?: string
): [D, (nodeData: D) => void] {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeDataHook) throw new Error(`Couldn't find a NodeDataHook to use.`);
  return ctx.nodeDataHook(ctx.instanceId, config, originalNodeData, storeId);
}

export function useArrayNodeIds<D>(
  parentConfig: NodeConfig,
  originalChildData: Array<D>
): {
  childIds: Array<string>,
  removeItem: (id: string) => void,
  addItem: (id: string, index?: number) => void
} {
  if(!Array.isArray(originalChildData)) throw new Error(`'${parentConfig.type}' renderer only works with arrays`)
  const originalChildIds = useMemo<Array<string>>(() => {
    return originalChildData.map(() => nanoid())
  }, [])
  const [ childIds, setChildMetaData ] = useNodeData(parentConfig, originalChildIds)
  return {
    childIds,
    removeItem: (id: string) => {
      setChildMetaData(childIds.filter(childId => childId !== id))
    },
    addItem: (id, index?) => {
      const clone = [...childIds]
      clone.splice(index || childIds.length, 0, id)
      setChildMetaData(clone)
    }
  }
}

export default function NodeDataProvider(
  {
    instanceId,
    nodeDataHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{ instanceId, nodeDataHook }}>
      {children}
    </Context.Provider>
  );
}