import { NodeRendererRegistration } from "@graphter/core";

const nodeRendererMap: { [key: string]: NodeRendererRegistration } = {};

export const register = (registration: NodeRendererRegistration) => {
  nodeRendererMap[`${registration.type}-b00f460f-01e1-4ed9-98f1-741c46cc4248`] = registration
}
export const registerAll = (registrations: Array<NodeRendererRegistration>) => {
  if(!registrations) return
  registrations.forEach(registration => register(registration))
}
export const get = (nodeType: string): NodeRendererRegistration => {
  const key = `${nodeType}-b00f460f-01e1-4ed9-98f1-741c46cc4248`
  let registration = nodeRendererMap[key]
  if(!registration) {
    console.warn(`No '${nodeType}' node renderer has been registered. Moving on...`)
  }
  return registration
}
export default {
  register,
  registerAll,
  get
}