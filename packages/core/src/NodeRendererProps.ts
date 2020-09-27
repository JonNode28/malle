import {
  NodeConfig,
  NodeDataProviderProps,
  ErrorRendererProps, ValidationResult
} from "./";
import { ComponentType } from "react";

export interface NodeRendererProps {
  id: string
  config: NodeConfig
  ancestryConfig: Array<NodeConfig>
  jsonPointer: string
  nodeData?: any
  /**
   * Used by a node renderer to indicate a completion action.
   * Can be used to add an item to or update an item in a list for example.
   */
  done?: () => void
  options?: any

  DataProvider: ComponentType<NodeDataProviderProps>
  ErrorDisplayComponent: ComponentType<ErrorRendererProps> | null
}