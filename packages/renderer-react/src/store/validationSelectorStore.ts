import { ReadOnlySelectorOptions, RecoilValueReadOnly, selector } from "recoil";

const validationSelectorMap: { [key: string]: RecoilValueReadOnly<any> } = {};
export default {
  get: (modelId: string, propertyId: string, selectorOptions: ReadOnlySelectorOptions<any> ) => {
    const key = `${modelId}-${propertyId}-790ef02a-ad02-482b-9b91-ba6290d8e813`
    let validationSelector = validationSelectorMap[key]
    if(!validationSelector) validationSelectorMap[key] = validationSelector = selector(selectorOptions)
    return validationSelector
  }
}