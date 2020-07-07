import { TypeRendererProps } from "./TypeRendererProps";
import { ModelConfig, PropertyConfig, ValidationResult } from "microo-core";
import { RecoilState } from "recoil";

export interface PropertyTypeRendererProps extends TypeRendererProps {
  propData: any
  modelData: any
  setPropDataValue: (value: any) => void
  setModelDataValue: (value: any) => void
  propertyConfig: PropertyConfig
  validationResults?: Array<ValidationResult>
}