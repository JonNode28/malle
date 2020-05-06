import EditDisplayConfig from "./EditDisplayConfig";

export default interface EditDisplayPropertyConfig extends EditDisplayConfig{
  options: EditDisplayPropertyConfigOptions
}

export interface EditDisplayPropertyConfigOptions{
  property: string
}