import React, { createContext, useContext } from 'react';
import { NodeConfig, PathSegment, ValidationResult } from "microo-core";

interface DataProviderProps {
  instanceId: string | number,
  nodeValidationHook: NodeValidationHook,
  children: any
}

export interface NodeValidationHook {
  (
    path: Array<PathSegment>
  ): Array<ValidationResult>
}

const Context = createContext<{ instanceId: string | number, nodeValidationHook: NodeValidationHook } | null>(null);

export const useNodeValidation = (
  path: Array<PathSegment>
): Array<ValidationResult> => {
  const ctx = useContext(Context);
  if (!ctx || !ctx.nodeValidationHook) throw new Error(`Couldn't find a NodeValidationHook to use.`);
  return ctx.nodeValidationHook(path);
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