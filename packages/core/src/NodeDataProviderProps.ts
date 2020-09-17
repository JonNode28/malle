import { ModelConfig, NodeConfig, PropertyConfig, ValidationResult } from "./";

export interface NodeDataProviderProps {
  config: NodeConfig
  originalNodeData: any
  jsonPointer: string
  children: (props: NodeDataProviderChildFunctionProps) => any
}
export interface NodeDataProviderChildFunctionProps {
  nodeData: any
  setNodeDataValue: (value: any) => void
  validationResults: Array<ValidationResult>
}