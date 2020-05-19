import { ModelConfig } from "./ModelConfig";
import { ValidationExecutionStage, ValidationResult, Validator } from "./Validator";

export interface ModelValidator extends Validator {
  execute: (stage: ValidationExecutionStage, config: ModelConfig, data: any) => Promise<ValidationResult>
}
