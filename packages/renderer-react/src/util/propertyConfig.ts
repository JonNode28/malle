import {PropertyConfig} from "../PropertyConfig";

export function getProp(id: string, properties: Array<PropertyConfig>): PropertyConfig {
  const matchingProp = queryProp(id, properties);
  if(typeof matchingProp === 'undefined') throw new Error(`Couldn't find prop matching '${id}' from layout config. Check the property exists.`);
  return matchingProp;
}

export function queryProp(id: string, properties: Array<PropertyConfig>): PropertyConfig | undefined{
  return properties.find(prop => prop.id === id);
}