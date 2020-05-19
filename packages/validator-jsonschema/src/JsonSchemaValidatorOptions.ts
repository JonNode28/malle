import { ValidationErrorDisplayMode, ValidationExecutionStage } from "microo-core";

export interface JsonSchemaValidatorOptions {
  schema: object,
  error?: string | ((data: any) => string)
  executeOn?: ValidationExecutionStage | Array<ValidationExecutionStage>
  errorDisplayMode?: ValidationErrorDisplayMode | Array<ValidationErrorDisplayMode>
}