import { ComponentType } from "react";
import { NodeRendererProps } from "microo-core";

const nodeRendererMap: { [key: string]: ComponentType<NodeRendererProps> } = {};

export const register = (nodeType: string, nodeRenderer: ComponentType<NodeRendererProps>) => {
  nodeRendererMap[`${nodeType}-b00f460f-01e1-4ed9-98f1-741c46cc4248`] = nodeRenderer
}
export const registerMap = (map: { [nodeType: string]: ComponentType<NodeRendererProps> }) => {
  Object.entries(map).forEach(([ nodeType, renderer ]) => register(nodeType, renderer))
}
export const get = (nodeType: string): ComponentType<NodeRendererProps> => {
  const key = `${nodeType}-b00f460f-01e1-4ed9-98f1-741c46cc4248`
  let propDataState = nodeRendererMap[key]
  if(!propDataState) {
    throw new Error(`No '${nodeType}' node renderer has been registered`)
  }
  return propDataState
}
export default {
  register,
  registerMap,
  get
}