import { EditDisplayConfig } from "./EditDisplayConfig";

export interface EditDisplayPropertyConfig extends EditDisplayConfig{
  options: EditDisplayPropertyConfigOptions
}

export interface EditDisplayPropertyConfigOptions{
  property: string
}