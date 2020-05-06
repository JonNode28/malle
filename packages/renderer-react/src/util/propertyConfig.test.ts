import {getProp, queryProp} from "./propertyConfig";
import {PropertyConfig} from "../PropertyConfig";

describe(`propertyConfig utils`, () => {
  let props: Array<PropertyConfig>;
  beforeEach(() => {
    props = [
      {
        id: 'id',
        name: 'ID',
        type: 'string'
      },
      {
        id: 'name',
        name: 'Name',
        type: 'string'
      }
    ];
  });
  describe(`getProp()`, () => {

    it(`should return the value when found`, () => {
      const result = getProp('name', props);
      expect(result).toEqual({
        id: 'name',
        name: 'Name',
        type: 'string'
      });
    });
    it(`should error when the prop can't be found`, () => {
      expect(() => {
        getProp('some-other-prop', props);
      }).toThrowErrorMatchingSnapshot();
    });
  });
  describe(`queryProp()`, () => {
    it(`should return the value when found`, () => {
      const result = queryProp('name', props);
      expect(result).toEqual({
        id: 'name',
        name: 'Name',
        type: 'string'
      });
    });
    it(`should return undefined when the prop can't be found`, () => {
      const result = queryProp('some-other-prop', props);
      expect(result).toBeUndefined();
    });
  });
});


export {};