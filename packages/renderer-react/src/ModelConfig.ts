import { ReactNode } from "react";
import {PropertyConfig} from "./PropertyConfig";
import ListDisplayConfig from "./ListDisplayConfig";
import EditDisplayConfig from "./EditDisplayConfig";

export default interface ModelConfig {
  id: string,
  name: string,
  description?: string,
  properties: Array<PropertyConfig>,
  identityPath?: Array<string>,
  display?: {
    list?: ListDisplayConfig,
    edit?: Array<EditDisplayConfig | string>
  }
}