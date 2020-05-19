import { ModelConfig, ValidationErrorDisplayMode, ValidationExecutionStage } from "microo-core";
import JsonSchemaModelValidator from "./JsonSchemaModelValidator";

describe(`JsonSchemaModelValidator`, () => {
  let modelConfig: ModelConfig;
  beforeEach(() => {
    modelConfig = {
      id: 'some-model',
      name: 'Some Model',
      properties: []
    }
  })
  it(`should return a valid response when executed with correct data`, async () => {
    const validator = new JsonSchemaModelValidator({
      schema: {
        minimum: 10,
        maximum: 12
      }
    });
    const result = await validator.execute(ValidationExecutionStage.CHANGE, modelConfig, 11);
    expect(result).not.toBeNull();
    expect(result.valid).toBe(true);
  });
  it(`should return an invalid response when executed with incorrect data`, async () => {
    const validator = new JsonSchemaModelValidator({
      schema: {
        minimum: 10,
        maximum: 12
      },
      error: `Must be at least 10 but no more than 12`
    });
    const result = await validator.execute(ValidationExecutionStage.CHANGE, modelConfig, 13);
    expect(result).not.toBeNull();
    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe(`Must be at least 10 but no more than 12`);
  });
  it(`should error when no schema is provided`, () => {
    expect(() => {
      // @ts-ignore
      new JsonSchemaModelValidator();
    }).toThrowErrorMatchingSnapshot();
  });
  it(`should set executeOn values correctly`, () => {
    const validator = new JsonSchemaModelValidator({
      schema: {
        maxLength: 5
      },
      executeOn: [
        ValidationExecutionStage.CHANGE
      ]
    });
    expect(validator.executeOn).not.toBeNull();
    expect(validator.executeOn).toHaveLength(1);
    expect(validator.executeOn[0]).toBe(ValidationExecutionStage.CHANGE);
  });
  it(`should return correct error display mode`, async () => {
    const validator = new JsonSchemaModelValidator({
      schema: {
        maxLength: 5
      },
      errorDisplayMode: ValidationErrorDisplayMode.MODAL
    });
    const result = await validator.execute(ValidationExecutionStage.CLIENT_UPDATE, modelConfig, 'Hello World!');
    expect(result.errorDisplayMode).not.toBeNull();
    expect(result.errorDisplayMode).toEqual([ ValidationErrorDisplayMode.MODAL ]);
  })
  it(`should default options correctly`, async () => {
    const validator = new JsonSchemaModelValidator({
      schema: {
        maxLength: 5
      }
    });
    expect(validator.executeOn).toMatchSnapshot();
    const result = await validator.execute(ValidationExecutionStage.CLIENT_UPDATE, modelConfig, 'Hello World!');
    expect(result.errorDisplayMode).toMatchSnapshot()
  });
});

export {};