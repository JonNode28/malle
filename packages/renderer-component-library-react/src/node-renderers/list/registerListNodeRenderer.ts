import ListNodeRenderer from "./ListNodeRenderer";
import { NodeRendererRegistration } from "microo-core";
import { JsonType } from "microo-core";

export interface ListNodeRendererOptions {
  type: string
}

export function registerListNodeRenderer(options: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    jsonType: JsonType.ARRAY,
    renderer: ListNodeRenderer,
    options
  }
}