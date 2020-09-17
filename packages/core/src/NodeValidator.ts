import { ModelConfig } from "./ModelConfig";
import { ValidationExecutionStage, ValidationResult, Validator } from "./Validator";
import { NodeConfig } from "./NodeConfig";

export interface NodeValidator extends Validator {
  execute: (
    stage: ValidationExecutionStage,
    config: NodeConfig,
    data: any) => Promise<ValidationResult>
}
