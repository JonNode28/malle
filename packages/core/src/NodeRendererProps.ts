import {
  NodeConfig,
  ErrorRendererProps
} from "./";
import { ComponentType } from "react";

export interface NodeRendererProps {
  config: NodeConfig
  ancestorConfigs: Array<NodeConfig>
  originalNodeData?: any
  /**
   * Used by a node renderer to indicate a completion action.
   * Can be used to add an item to or update an item in a list for example.
   */
  done?: () => void
  options?: any
  /**
   * Used to keep track of enumerable items
   */
  itemId?: string

  ErrorDisplayComponent: ComponentType<ErrorRendererProps> | null
}