import { ModelConfig, ValidationErrorDisplayMode, ValidationExecutionStage } from "microo-core";
import JsonSchemaPropertyValidator from "./JsonSchemaPropertyValidator";


describe(`JsonSchemaPropertyValidator`, () => {
  let modelConfig: ModelConfig;
  beforeEach(() => {
    modelConfig = {
      id: 'some-model',
      name: 'Some Model',
      properties: [
        {
          id: 'title',
          name: 'Title',
          type: 'string'
        }
      ]
    }
  })
  it(`should return a valid response when executed with correct data`, async () => {
    const validator = new JsonSchemaPropertyValidator({
      schema: {
        minLength: 3
      }
    });
    const data = {
      title: 'A valid page title'
    }
    const result = await validator.execute(ValidationExecutionStage.CHANGE, modelConfig.properties[0], modelConfig, data);
    expect(result).not.toBeNull();
    expect(result.valid).toBe(true);
  });
  it(`should return an invalid response when executed with incorrect data`, async () => {
    const validator = new JsonSchemaPropertyValidator({
      schema: {
        minLength: 3
      },
      error: `Title must be at least 3 characters long`
    });
    const data = {
      title: 'A'
    }
    const result = await validator.execute(ValidationExecutionStage.CHANGE, modelConfig.properties[0], modelConfig, data);
    expect(result).not.toBeNull();
    expect(result.valid).toBe(false);
    expect(result.errorMessage).toBe(`Title must be at least 3 characters long`);
  });
  it(`should error when no schema is provided`, () => {
    expect(() => {
      // @ts-ignore
      new JsonSchemaPropertyValidator();
    }).toThrowErrorMatchingSnapshot();
  });
  it(`should set executeOn values correctly`, () => {
    const validator = new JsonSchemaPropertyValidator({
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
    const validator = new JsonSchemaPropertyValidator({
      schema: {
        maxLength: 5
      },
      errorDisplayMode: ValidationErrorDisplayMode.MODAL
    });
    const data = {
      title: 'Hello World!'
    }
    const result = await validator.execute(ValidationExecutionStage.CLIENT_UPDATE, modelConfig.properties[0], modelConfig, data);
    expect(result.errorDisplayMode).not.toBeNull();
    expect(result.errorDisplayMode).toEqual([ ValidationErrorDisplayMode.MODAL ]);
  })
  it(`should default options correctly`, async () => {
    const validator = new JsonSchemaPropertyValidator({
      schema: {
        maxLength: 5
      }
    });
    const data = {
      title: 'Hello World!'
    }
    expect(validator.executeOn).toMatchSnapshot();
    const result = await validator.execute(ValidationExecutionStage.CLIENT_UPDATE, modelConfig.properties[0], modelConfig, data);
    expect(result.errorDisplayMode).toMatchSnapshot()
  });
});

export {};