import { ModelConfig } from "./ModelConfig";
import { ValidationExecutionStage, ValidationResult, Validator } from "./Validator";
import { PropertyConfig } from "./PropertyConfig";

export interface PropertyValidator extends Validator {
  execute: (
    stage: ValidationExecutionStage,
    propertyConfig: PropertyConfig,
    modelConfig: ModelConfig,
    data: any
  ) => Promise<ValidationResult>
}