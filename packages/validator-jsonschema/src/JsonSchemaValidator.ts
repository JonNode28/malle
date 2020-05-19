import Ajv from 'ajv';
import { ValidationErrorDisplayMode, ValidationExecutionStage, ValidationResult, Validator } from "microo-core";
import { JsonSchemaValidatorOptions } from "./JsonSchemaValidatorOptions";

export default class JsonSchemaValidator implements Validator {
  protected readonly _options: JsonSchemaValidatorOptions;
  protected readonly _validateFn: Ajv.ValidateFunction;
  executeOn: Array<ValidationExecutionStage>;

  constructor(options: JsonSchemaValidatorOptions) {
    if(!options || !options.schema) throw new Error(`Schema option is required by JsonSchemaValidator`);
    this._options = {
      executeOn: [
        ValidationExecutionStage.CLIENT_CREATE,
        ValidationExecutionStage.CLIENT_UPDATE,
        ValidationExecutionStage.SERVER_UPDATE,
        ValidationExecutionStage.SERVER_UPDATE
      ],
      errorDisplayMode: [
        ValidationErrorDisplayMode.INLINE,
        ValidationErrorDisplayMode.SUMMARY
      ],
      ...options
    };
    if(Array.isArray(this._options.executeOn)){
      this.executeOn = this._options.executeOn;
    } else if(this._options.executeOn !== undefined){
      this.executeOn = [this._options.executeOn];
    } else throw new Error(`Shouldn't happen if defaulting was done properly`);

    const ajv = new Ajv({
      jsonPointers: true,
      allErrors: true
    });
    this._validateFn = ajv.compile(options.schema);
  }

}