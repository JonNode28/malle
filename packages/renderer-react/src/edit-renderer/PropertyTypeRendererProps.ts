import { DisplayTypeRendererProps } from "./DisplayTypeRendererProps";
import { ModelConfig, PropertyConfig, ValidationResult } from "microo-core";
import { RecoilState } from "recoil";

export interface PropertyTypeRendererProps extends DisplayTypeRendererProps {
  propertyConfig: PropertyConfig
  modelConfig: ModelConfig
  propData: any
  modelData: any
  setPropDataValue: (value: any) => void
  setModelDataValue: (value: any) => void
  validationResults?: Array<ValidationResult>
}