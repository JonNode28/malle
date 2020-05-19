import { TypeRendererProps } from "./TypeRendererProps";
import { PropertyConfig, ValidationResult } from "microo-core";

export interface PropertyTypeRendererProps extends TypeRendererProps {
  propertyConfig: PropertyConfig,
  validationResults?: Array<ValidationResult>
}