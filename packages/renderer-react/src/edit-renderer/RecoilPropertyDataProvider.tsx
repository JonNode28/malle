import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { getPropertyJsonPointer } from "../util/model";
import {
  ModelConfig,
  PropertyConfig,
  PropertyValidator,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import { useEffect, useMemo, useState } from "react";
import propDataStore from "../store/propDataStore";

interface RecoilPropertyDataProviderProps {
  modelConfig: ModelConfig
  propertyConfig: PropertyConfig
  startingPropData: any
  children: (props: ChildFunctionProps) => any
}
interface ChildFunctionProps {
  modelConfig: ModelConfig
  propertyConfig: PropertyConfig
  propData: any
  modelData: any
  setPropDataValue: (value: any) => void
  setModelDataValue: (value: any) => void
  validationResults: Array<ValidationResult>
}
export default function RecoilPropertyDataProvider({ modelConfig, propertyConfig, startingPropData, children }: RecoilPropertyDataProviderProps){
  if(typeof children !== 'function') throw new Error(`<RecoilPropDataProvider /> must be passed a function child`);

  const propJsonPointer = getPropertyJsonPointer(propertyConfig);

  const propDataState = propDataStore.get(modelConfig.id, propJsonPointer, startingPropData)

  const [ propData, setPropData ] = useRecoilState(propDataState);

  const onChangeValidators = useMemo(() => {
    if(!propertyConfig.validation) return null
    let validations:Array<PropertyValidator> = Array.isArray(propertyConfig.validation) ? propertyConfig.validation : [ propertyConfig.validation ]
    return validations.filter(validation => validation.executeOn.indexOf(ValidationExecutionStage.CHANGE))
  }, [ propertyConfig ])

  const [ validationResults, setValidationResults ] = useState<Array<ValidationResult>>([])

  useEffect(() => {
    if(!onChangeValidators) return
    (async () => {
      const results = await Promise.all(onChangeValidators.map(validator =>
        validator.execute(
          ValidationExecutionStage.CHANGE,
          propertyConfig,
          modelConfig,
          propData
        )))
      const flattenedValidationResults = results.reduce<ValidationResult[]>((a, c) => {
        if(Array.isArray(c)) return a.concat(c)
        a.push(c)
        return a
      }, [])
      setValidationResults(flattenedValidationResults)
    })()
  }, [ propData ])

  //const validationResultsSelector = validationSelectorStore.get(propDataState, modelConfig, propertyConfig)

  //const validationResults = validationResultsSelector ? useRecoilValue(validationResultsSelector): []

  //
  // const modelDataSelector = selector<any>({
  //   key: 'ModelDataSelector',
  //   get: ({ get }) => {
  //     console.info('Getting entire model data');
  //     return modelConfig.properties.reduce((a, c): any => {
  //       const jsonPointer = getPropertyJsonPointer(c);
  //       const state = propertyStateMap[jsonPointer];
  //       if(!state) return;
  //       ptr.set(a, jsonPointer, get(state))
  //     }, {})
  //   },
  //   set: ({ get, set }, newValue) => {
  //     console.info('Setting entire model data');
  //     modelConfig.properties.forEach(propertyConfig => {
  //       const jsonPointer = getPropertyJsonPointer(propertyConfig);
  //       const state = propertyStateMap[jsonPointer];
  //       if(!state) return;
  //       set(state, ptr.get(newValue, jsonPointer)); // TODO: Optimise with a prev/next equality check
  //     });
  //   }
  // });
  //
  // const [ modelData, setModelData ] = useRecoilState<any>(modelDataSelector);

  return children({
    propertyConfig,
    modelConfig,
    propData: propData,
    modelData: null,
    setPropDataValue: setPropData,
    setModelDataValue: () => {},
    validationResults
  });
}