import {
  NodeConfig,
  NodeDataProviderProps,
  ErrorRendererProps
} from "./";
import { ComponentType } from "react";

export interface NodeRendererProps {
  config: NodeConfig
  ancestryConfig: Array<NodeConfig>
  jsonPointer: string
  originalNodeData: any
  options?: any

  DataProvider: ComponentType<NodeDataProviderProps>
  ErrorDisplayComponent: ComponentType<ErrorRendererProps> | null
}