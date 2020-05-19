import { PropertyValidator } from "./PropertyValidator";

export interface PropertyConfig {
  id: string
  name?: string
  description?: string
  type: string
  default?: any | Function
  validation?: PropertyValidator | Array<PropertyValidator>
}