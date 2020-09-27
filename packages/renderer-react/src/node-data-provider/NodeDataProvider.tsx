import React, { createContext, useContext } from 'react';
import { NodeConfig } from "microo-core";

interface DataProviderProps {
  nodeDataHook: NodeDataHook,
  config: NodeConfig,
  children: any
}

export interface NodeDataHook {
  (
    config: NodeConfig,
    storeId: string,
    originalNodeData: any
  ): [ any, (value: any) => void ]
}

const Context = createContext<{ nodeDataHook: NodeDataHook, config: NodeConfig } | null>(null);

export function useNodeData(storeId: string, jsonPointer: string, originalNodeData: any): [ any, (value: any) => void ] {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeDataHook) throw new Error(`Couldn't find a NodeDataHook to use.`);
  return ctx.nodeDataHook(ctx.config, storeId, originalNodeData);
}

export default function NodeDataProvider(
  {
    config,
    nodeDataHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{ nodeDataHook, config }}>
      {children}
    </Context.Provider>
  );
}