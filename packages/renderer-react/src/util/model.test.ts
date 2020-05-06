import {createNewInstance} from "./model";

describe('createNewInstance()', () => {
  it(`should return an empty object when no defaults are defined`, () => {
    const newModelInstance = createNewInstance({
      id: 'some-model',
      name: 'SomeModel',
      properties: [
        {
          id: 'name',
          type: 'string'
        }
      ]
    });
    expect(newModelInstance).toEqual({ });
  });
  it(`should create a new model instance from config with the provided static defaults`, () => {
    const newModelInstance = createNewInstance({
      id: 'some-model',
      name: 'SomeModel',
      properties: [
        {
          id: 'name',
          type: 'string',
          default: 'Untitled'
        }
      ]
    });
    expect(newModelInstance).toEqual({
      'name': 'Untitled'
    });
  });
  it(`should create a new model instance from config with the provided dynamic defaults`, () => {
    const newModelInstance = createNewInstance({
      id: 'some-model',
      name: 'SomeModel',
      properties: [
        {
          id: 'id',
          type: 'string',
          default: () => 'some-dynamically-generated-id'
        }
      ]
    });
    expect(newModelInstance).toEqual({
      'id': 'some-dynamically-generated-id'
    });
  });
});

export {};