import { NodeValidator } from "./NodeValidator";

export interface NodeConfig {
  id: string
  name?: string
  type: string
  description?: string
  children?: Array<NodeConfig>
  identityPath?: Array<string>
  validation?: NodeValidator | Array<NodeValidator>
  identifier?: boolean
  default?: any | Function
}