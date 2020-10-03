import propDataStore from "../store/propDataStore";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { NodeConfig, ValidationExecutionStage, ValidationResult } from "microo-core";
import { NodeValidator } from "microo-core/dist/NodeValidator";
import { NodeValidationHook } from "./NodeValidationProvider";

export const useRecoilNodeValidation: NodeValidationHook = (
  instanceId: string | number,
  config: NodeConfig,
  originalNodeData: any,
  storeId?: string
) => {
  if(!propDataStore.has(instanceId, config, storeId)){
    propDataStore.set(instanceId, config, originalNodeData, storeId)
  }
  const propDataState = storeId ?
    propDataStore.getByStoreId(storeId) :
    propDataStore.getByConfig(instanceId, config)

  const propData = useRecoilValue(propDataState)

  const onChangeValidators = useMemo(() => {
    if(!config.validation) return null
    let validations:Array<NodeValidator> = Array.isArray(config.validation) ? config.validation : [ config.validation ]
    return validations.filter(validation => validation.executeOn.includes(ValidationExecutionStage.CHANGE))
  }, [ config ])

  const [ validationResults, setValidationResults ] = useState<Array<ValidationResult>>([])

  useEffect(() => {
    if(onChangeValidators) {
      (async () => {
        const results = await Promise.all(onChangeValidators.map(validator =>
          validator.execute(
            ValidationExecutionStage.CHANGE,
            config,
            propData
          )))
        const flattenedValidationResults = results.reduce<ValidationResult[]>((a, c) => {
          if (Array.isArray(c)) return a.concat(c)
          a.push(c)
          return a
        }, [])
        setValidationResults(flattenedValidationResults)
      })()
    }
  }, [ propData ])

  return validationResults
}

export default useRecoilNodeValidation