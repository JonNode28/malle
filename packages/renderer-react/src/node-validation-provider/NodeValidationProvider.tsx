import React, { createContext, useContext } from 'react';
import { NodeConfig, ValidationResult } from "microo-core";

interface DataProviderProps {
  instanceId: string | number,
  nodeValidationHook: NodeValidationHook,
  config: NodeConfig,
  children: any
}

export interface NodeValidationHook {
  (
    instanceId: string | number,
    config: NodeConfig,
    originalNodeData: any,
    storeId?: string,
  ): Array<ValidationResult>
}

const Context = createContext<{ instanceId: string | number, nodeValidationHook: NodeValidationHook } | null>(null);

export const useNodeValidation = (
  config: NodeConfig,
  originalNodeData: any,
  storeId?: string
): Array<ValidationResult> => {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeValidationHook) throw new Error(`Couldn't find a NodeValidationHook to use.`);
  return ctx.nodeValidationHook(ctx.instanceId, config, originalNodeData, storeId);
}

export default function NodeValidationProvider(
  {
    instanceId,
    nodeValidationHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={{ instanceId, nodeValidationHook }}>
      {children}
    </Context.Provider>
  );
}