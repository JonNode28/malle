import {PropertyConfig} from "../PropertyConfig";
import EditDisplayConfig from "../EditDisplayConfig";
import {getProp} from "./propertyConfig";
import EditDisplayPropertyConfig from "../EditDisplayPropertyConfig";

export function expand(editDisplayConfig: Array<EditDisplayConfig | string> | undefined, properties: Array<PropertyConfig>): Array<EditDisplayConfig>{
  if(!editDisplayConfig) {
    return createDefaultDisplayConfig(properties)
  }
  return editDisplayConfig.map(displayConfigItem => {
    if(typeof displayConfigItem === 'string'){
      return expandStringShorthandProperty(properties, displayConfigItem)
    }

    const expandedDisplayConfig = {...displayConfigItem};

    if(!displayConfigItem.typeRenderer){
      expandedDisplayConfig.typeRenderer = inferTypeRenderer(properties, displayConfigItem);
    }

    if(expandedDisplayConfig.children && expandedDisplayConfig.children.length){
      expandedDisplayConfig.children = expand(expandedDisplayConfig.children, properties);
    }

    return expandedDisplayConfig;
  });

}

export function isPropertyConfig(property: EditDisplayConfig): property is EditDisplayPropertyConfig{
  return property.type === 'property';
}

function expandStringShorthandProperty(properties: Array<PropertyConfig>, stringShorthand: string): EditDisplayConfig{
  const matchingProp = getProp(stringShorthand, properties);
  return {
    type: 'property',
    typeRenderer: matchingProp.type,
    options: {
      property: stringShorthand
    }
  }
}

function inferTypeRenderer(properties: Array<PropertyConfig>, displayConfig: EditDisplayConfig){
  if(displayConfig.type === 'property') {
    const matchingProp = getProp(displayConfig.options.property, properties);
    return matchingProp.type;
  } else {
    return displayConfig.type;
  }
}

function createDefaultDisplayConfig(properties: Array<PropertyConfig>): Array<EditDisplayConfig>{
  return properties.map(prop => ({
    type: 'property',
    typeRenderer: prop.type,
    options: {
      property: prop.id
    }
  }));
}
