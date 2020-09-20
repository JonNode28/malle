import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";

export interface NodeRendererRegistration{
  type: string
  renderer: ComponentType<NodeRendererProps>
  options?: any
}