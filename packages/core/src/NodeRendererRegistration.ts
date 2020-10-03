import { ComponentType } from "react";
import { NodeRendererProps } from "./NodeRendererProps";
import { JsonType } from "./JsonType";

export interface NodeRendererRegistration{
  type: string
  jsonType: JsonType
  renderer: ComponentType<NodeRendererProps>
  options?: any
}