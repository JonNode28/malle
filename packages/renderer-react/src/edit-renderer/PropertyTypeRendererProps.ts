import { DisplayTypeRendererProps } from "./DisplayTypeRendererProps";
import { EditDisplayConfig, ModelConfig, PropertyConfig, ValidationResult } from "microo-core";
import { RecoilState } from "recoil";
import { ComponentType } from "react";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";

export interface PropertyTypeRendererProps extends DisplayTypeRendererProps {
  propertyConfig: PropertyConfig
  displayConfig: EditDisplayConfig
  modelConfig: ModelConfig
  propData: any
  modelData: any
  setPropDataValue: (value: any) => void
  setModelDataValue: (value: any) => void
  validationResults?: Array<ValidationResult>
  errorRenderer: ComponentType<ErrorRendererProps> | null
  displayTypeRenderers: { [typeId: string]: ComponentType<DisplayTypeRendererProps> }
  propertyTypeRenderers: { [typeId: string]: ComponentType<PropertyTypeRendererProps> }
}