import StringNodeRenderer from "./StringNodeRenderer";
import { NodeRendererRegistration } from "microo-core";

export interface StringNodeRendererOptions {
  type: string
}

export function registerStringNodeRenderer(options: StringNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'string',
    renderer: StringNodeRenderer,
    options
  }
}