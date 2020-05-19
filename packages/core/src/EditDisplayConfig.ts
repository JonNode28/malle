export interface EditDisplayConfig {
  type: string,
  typeRenderer?: string,
  children?: Array<EditDisplayConfig | string>
  options?: any,
}