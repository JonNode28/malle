import JsonSchemaValidator from "./JsonSchemaValidator";
import { JsonSchemaValidatorOptions } from "./JsonSchemaValidatorOptions";
import {
  NodeConfig,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import generateErrorMessage from "./generateErrorMessage";
import { NodeValidator } from "microo-core/dist/NodeValidator";

export default class JsonSchemaNodeValidator extends JsonSchemaValidator implements NodeValidator{
  _options: JsonSchemaValidatorOptions
  constructor(options: JsonSchemaValidatorOptions) {
    super(options);
    this._options = options
  }
  execute(stage: ValidationExecutionStage, config: NodeConfig, nodeData: any): Promise<ValidationResult> {
    const valid = this._validateFn(nodeData);
    console.log(`${config.id} value of ${JSON.stringify(nodeData)} ${valid?'passed':'failed'} validation: ${JSON.stringify(this._options)}`)
    if(valid){
      return Promise.resolve({
        valid: true,
        dataPaths: [ config.id ]
      });
    } else {
      const result: ValidationResult = {
        valid: false,
        errorMessage: generateErrorMessage(nodeData, this._options, this._validateFn),
      }

      if(this._validateFn.errors){
        result.dataPaths = this._validateFn.errors.map(err => config.id + err.dataPath);
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