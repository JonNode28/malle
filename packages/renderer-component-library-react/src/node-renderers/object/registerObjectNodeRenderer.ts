import ObjectNodeRenderer from "./ObjectNodeRenderer";
import { NodeRendererRegistration } from "microo-core";

export interface ObjectNodeRendererOptions {
  type: string
}

export function registerObjectNodeRenderer(options: ObjectNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'object',
    renderer: ObjectNodeRenderer,
    options
  }
}