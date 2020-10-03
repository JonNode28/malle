import StringNodeRenderer from "./StringNodeRenderer";
import { NodeRendererRegistration } from "microo-core";
import { JsonType } from "microo-core";

export interface StringNodeRendererOptions {
  type: string
}

export function registerStringNodeRenderer(options: StringNodeRendererOptions): NodeRendererRegistration {
  return {
    type: options?.type || 'string',
    jsonType: JsonType.STRING,
    renderer: StringNodeRenderer,
    options
  }
}