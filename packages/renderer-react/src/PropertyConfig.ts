import {ValidationConfig} from "./ValidationConfig";

export interface PropertyConfig {
  id: string,
  name?: string,
  description?: string,
  type: string,
  validations?: Array<ValidationConfig>,
  default?: any | Function
}