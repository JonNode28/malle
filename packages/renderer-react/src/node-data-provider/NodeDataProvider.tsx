import React, { createContext, useContext, useMemo } from 'react';
import { NodeConfig } from "microo-core";
import { nanoid } from "nanoid";
import useRecoilArrayNodeData from "./useRecoilArrayNodeData";

interface DataProviderProps {
  instanceId: string | number,
  nodeDataHook: NodeDataHook,
  arrayNodeDataHook: ArrayNodeDataHook,
  children: any
}

export interface NodeDataHook {
  (
    instanceId: string | number,
    config: NodeConfig,
    ancestorConfig: Array<NodeConfig>,
    originalNodeData: any,
    committed: boolean,
    index?: number,
  ): [ any, (value: any) => void ]
}
export interface ArrayNodeDataHook {
  (
    instanceId: string | number,
    config: NodeConfig,
    ancestorConfigs: Array<NodeConfig>,
    originalNodeData: Array<any>,
    committed: boolean,
    index?: number,
  ): {
    childIds: Array<string>,
    removeItem: (index: number) => void,
    commitItem: (index: number) => void
  }
}

const Context = createContext<{
  instanceId: string | number,
  nodeDataHook: NodeDataHook,
  arrayNodeDataHook: ArrayNodeDataHook
} | null>(null);

export function useNodeData<D>(
  config: NodeConfig,
  ancestorConfigs: Array<NodeConfig>,
  originalNodeData: D,
  committed: boolean = true,
  index?: number
): [D, (nodeData: D) => void] {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeDataHook) throw new Error(`Couldn't find a NodeDataHook or context to use.`);
  return ctx.nodeDataHook(ctx.instanceId, config, ancestorConfigs, originalNodeData, committed, index);
}

export function useArrayNodeData<D>(
  config: NodeConfig,
  ancestorConfigs: Array<NodeConfig>,
  originalChildData: Array<D>,
  committed: boolean,
  index?: number,
): {
  childIds: Array<string>,
  removeItem: (index: number) => void,
  commitItem: (index: number) => void
} {
  const ctx = useContext(Context);
  if (!ctx || !ctx.arrayNodeDataHook) throw new Error(`Couldn't find an ArrayNodeDataHook or context to use.`);
  if(!Array.isArray(originalChildData)) throw new Error(`'${config.type}' renderer only works with arrays`)

  return ctx.arrayNodeDataHook(ctx.instanceId, config, ancestorConfigs, originalChildData, committed, index)
}

export default function NodeDataProvider(
  {
    instanceId,
    nodeDataHook,
    arrayNodeDataHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{ instanceId, nodeDataHook, arrayNodeDataHook }}>
      {children}
    </Context.Provider>
  );
}