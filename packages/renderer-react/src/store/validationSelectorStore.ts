import { RecoilValue, RecoilValueReadOnly, selector } from "recoil";
import { ModelConfig, PropertyConfig, PropertyValidator, ValidationExecutionStage } from "microo-core";

const validationSelectorMap: { [key: string]: RecoilValueReadOnly<any> } = {};

export default {
  get: (
    propDataState: RecoilValue<any>,
    modelConfig: ModelConfig,
    propertyConfig: PropertyConfig
  ): RecoilValueReadOnly<any> | null => {
    const validatorKey = `${modelConfig.id}-${propertyConfig.id}-790ef02a-ad02-482b-9b91-ba6290d8e813`
    let validationSelector = validationSelectorMap[validatorKey]
    if(validationSelector) return validationSelector;

    if(!propertyConfig.validation) return null
    let validations:Array<PropertyValidator> = Array.isArray(propertyConfig.validation) ?
      propertyConfig.validation :
      [ propertyConfig.validation ]

    const onChangeValidators = validations.filter(validation =>
      validation.executeOn.indexOf(ValidationExecutionStage.CHANGE))
    validationSelectorMap[validatorKey] = validationSelector = selector({
      key: `${modelConfig.id}-${propertyConfig.id}-790ef02a-ad02-482b-9b91-ba6290d8e813`,
      get: async({ get }) => {
        const propData = get(propDataState)
        const result = await Promise.all(onChangeValidators.map(validator =>
          validator.execute(
            ValidationExecutionStage.CHANGE,
            propertyConfig,
            modelConfig,
            propData)))
        return result
      }
    })
    return validationSelector
  }
}