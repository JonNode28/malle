import React, { createContext, useContext } from 'react';
import { NodeConfig, ValidationResult } from "microo-core";

interface DataProviderProps {
  nodeValidationHook: NodeValidationHook,
  config: NodeConfig,
  children: any
}

export interface NodeValidationHook {
  (
    storeId: string,
    config: NodeConfig,
    originalNodeData: any
  ): Array<ValidationResult>
}

const Context = createContext<NodeValidationHook | null>(null);

export function useNodeValidation(storeId: string, config: NodeConfig, jsonPointer: string, originalNodeData: any): Array<ValidationResult> {
  const nodeValidationHook = useContext(Context);
  if (!nodeValidationHook) throw new Error(`Couldn't find a NodeValidationHook to use.`);
  return nodeValidationHook(storeId, config, originalNodeData);
}

export default function NodeValidationProvider(
  {
    nodeValidationHook,
    children
  }: DataProviderProps
) {
  return (
    <Context.Provider value={nodeValidationHook}>
      {children}
    </Context.Provider>
  );
}