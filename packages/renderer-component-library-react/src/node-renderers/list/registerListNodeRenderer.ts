import ListNodeRenderer from "./ListNodeRenderer";
import { NodeRendererRegistration } from "microo-core";

export interface ListNodeRendererOptions {
  type: string
}

export function registerListNodeRenderer(options: ListNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'list',
    renderer: ListNodeRenderer,
    options
  }
}