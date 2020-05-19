import {PropertyConfig} from "./PropertyConfig";
import { ListDisplayConfig } from "./ListDisplayConfig";
import { EditDisplayConfig } from "./EditDisplayConfig";
import { ModelValidator } from "./ModelValidator";

export interface ModelConfig {
  id: string
  name: string
  description?: string
  properties: Array<PropertyConfig>
  identityPath?: Array<string>
  display?: {
    list?: ListDisplayConfig
    edit?: Array<EditDisplayConfig | string>
  },
  validation?: ModelValidator | Array<ModelValidator>
}