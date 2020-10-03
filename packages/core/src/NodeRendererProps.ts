import {
  NodeConfig,
  ErrorRendererProps
} from "./";
import { ComponentType } from "react";

export interface NodeRendererProps {
  id: string
  config: NodeConfig
  ancestorConfigs: Array<NodeConfig>
  jsonPointer: string
  originalNodeData?: any
  /**
   * Used by a node renderer to indicate a completion action.
   * Can be used to add an item to or update an item in a list for example.
   */
  done?: () => void
  options?: any

  ErrorDisplayComponent: ComponentType<ErrorRendererProps> | null
}