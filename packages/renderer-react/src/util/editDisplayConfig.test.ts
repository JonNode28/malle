import { expand } from './editDisplayConfig';
import { EditDisplayConfig, ModelConfig } from "microo-core";

describe(`editDisplayLayout.ts`, () => {
  let baseConfig: ModelConfig;
  beforeEach(() => {
    baseConfig = {
      id: 'page',
      name: 'Page',
      properties: [
        {
          id: 'title',
          name: 'Title',
          description: 'The page description',
          type: 'string'
        },
        {
          id: 'authorName',
          name: 'Author',
          description: 'The name of the author',
          type: 'string',
        },
        {
          id: 'body',
          name: 'Body',
          description: 'The content of the page',
          type: 'string'
        }
      ]
    }
  })
  it(`should guess the layout if none is provided`, () => {
    const result = expand(baseConfig.display?.edit, baseConfig.properties);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(3);
    expect(result[0].type).toBe('property');
    expect(result[0].options).toEqual({ property: 'title' });
    expect(result[0].typeRenderer).toBe('string');
    expect(result[1].type).toBe('property');
    expect(result[1].options).toEqual({ property: 'authorName' });
    expect(result[1].typeRenderer).toBe('string');
    expect(result[2].type).toBe('property');
    expect(result[2].options).toEqual({ property: 'body' });
    expect(result[2].typeRenderer).toBe('string');
  });
  it(`should correctly expand shorthand property display configurations`, () => {
    baseConfig.display = {
      edit: [
        'body'
      ]
    };
    const result = expand(baseConfig.display?.edit, baseConfig.properties);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('property');
    expect(result[0].options).toEqual({ property: 'body' });
    expect(result[0].typeRenderer).toBe('string');
  });
  it(`should correctly expand display (i.e. non-prop) type display configurations`, () => {
    baseConfig.display = {
      edit: [
        { type: 'custom-config' }
      ]
    }
    const result = expand(baseConfig.display?.edit, baseConfig.properties);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('custom-config');
    expect(result[0].typeRenderer).toBe('custom-config');
  });
  it(`should correctly expand nested property display configurations`, () => {
    baseConfig.display = {
      edit: [
        {
          type: 'row',
          children: [
            {
              type: 'column',
              children: [
                { type: 'property', options: { property: 'body' } }
              ]
            }
          ]
        }
      ]
    };
    const result = expand(baseConfig.display?.edit, baseConfig.properties);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('row');
    expect(result[0].typeRenderer).toBe('row');
    expect(result[0].children).not.toBeNull();
    expect(result[0].children).toHaveLength(1);
    if(!result[0].children) return;
    const nested1 = result[0].children[0] as EditDisplayConfig;
    expect(nested1.type).toBe('column');
    expect(nested1.typeRenderer).toBe('column');
    expect(nested1.children).not.toBeNull();
    expect(nested1.children).toHaveLength(1);
    if(!nested1.children) return;
    const nested2 = nested1.children[0] as EditDisplayConfig;
    expect(nested2.type).toBe('property');
    expect(nested2.options).toEqual({ property: 'body' });
    expect(nested2.typeRenderer).toBe('string')
  });
  it(`should correctly expand nested shorthand property display configurations`, () => {
    baseConfig.display = {
      edit: [
        {
          type: 'row',
          children: [
            {
              type: 'column',
              children: [
                'body'
              ]
            }
          ]
        }
      ]
    };
    const result = expand(baseConfig.display?.edit, baseConfig.properties);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('row');
    expect(result[0].typeRenderer).toBe('row');
    expect(result[0].children).not.toBeNull();
    expect(result[0].children).toHaveLength(1);
    if(!result[0].children) return;
    const nested1 = result[0].children[0] as EditDisplayConfig;
    expect(nested1.type).toBe('column');
    expect(nested1.typeRenderer).toBe('column');
    expect(nested1.children).not.toBeNull();
    expect(nested1.children).toHaveLength(1);
    if(!nested1.children) return;
    const nested2 = nested1.children[0] as EditDisplayConfig;
    expect(nested2.type).toBe('property');
    expect(nested2.options).toEqual({ property: 'body' });
    expect(nested2.typeRenderer).toBe('string')
  });
});