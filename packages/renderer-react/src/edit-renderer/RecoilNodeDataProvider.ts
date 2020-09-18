import { useRecoilState } from "recoil";
import {
  NodeDataProviderProps,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import { useEffect, useMemo, useState } from "react";
import propDataStore from "../store/propDataStore";
import { NodeValidator } from "microo-core/dist/NodeValidator";

export default function RecoilNodeDataProvider({ config,  originalNodeData, jsonPointer, children }: NodeDataProviderProps){
  if(typeof children !== 'function') throw new Error(`<RecoilNodeDataProvider /> must contain a nested function`);

  const propDataState = propDataStore.get(config.id, jsonPointer, originalNodeData)

  const [ propData, setPropData ] = useRecoilState(propDataState);

  const onChangeValidators = useMemo(() => {
    if(!config.validation) return null
    let validations:Array<NodeValidator> = Array.isArray(config.validation) ? config.validation : [ config.validation ]
    return validations.filter(validation => validation.executeOn.indexOf(ValidationExecutionStage.CHANGE))
  }, [ config ])

  const [ validationResults, setValidationResults ] = useState<Array<ValidationResult>>([])

  useEffect(() => {
    if(!onChangeValidators) return
    (async () => {
      const results = await Promise.all(onChangeValidators.map(validator =>
        validator.execute(
          ValidationExecutionStage.CHANGE,
          config,
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
    nodeData: propData,
    setNodeDataValue: setPropData,
    validationResults
  });
}