import JsonSchemaValidator from "./JsonSchemaValidator";
import { JsonSchemaValidatorOptions } from "./JsonSchemaValidatorOptions";
import {
  ModelConfig,
  ModelValidator,
  PropertyValidator,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import generateErrorMessage from "./generateErrorMessage";

export default class JsonSchemaModelValidator extends JsonSchemaValidator implements ModelValidator{
  constructor(options: JsonSchemaValidatorOptions) {
    super(options);
  }
  execute(stage: ValidationExecutionStage, config: ModelConfig, data: any): Promise<ValidationResult> {
    const valid = this._validateFn(data);
    if(valid){
      return Promise.resolve({
        valid: true
      });
    } else {
      const result: ValidationResult = {
        valid: false,
        errorMessage: generateErrorMessage(data, this._options, this._validateFn)
      }

      if(this._validateFn.errors){
        result.dataPaths = this._validateFn.errors.map(err => err.dataPath);
      }

      if(Array.isArray(this._options.errorDisplayMode)){
        result.errorDisplayMode = this._options.errorDisplayMode;
      } else if(this._options.errorDisplayMode !== undefined){
        result.errorDisplayMode = [ this._options.errorDisplayMode ];
      }

      return Promise.resolve(result);
    }
  }
}