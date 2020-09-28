import propDataStore from "../store/propDataStore";
import { useRecoilState } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { NodeConfig, ValidationExecutionStage, ValidationResult } from "microo-core";
import { NodeValidator } from "microo-core/dist/NodeValidator";
import { NodeValidationHook } from "./NodeValidationProvider";

export const useRecoilNodeValidation: NodeValidationHook = (storeId: string, config: NodeConfig, originalNodeData: any) => {
  const propDataState = propDataStore.get('GETTHEINSTANCEID!', storeId, originalNodeData)

  const [ propData, setPropData ] = useRecoilState(propDataState);

  const onChangeValidators = useMemo(() => {
    if(!config.validation) return null
    let validations:Array<NodeValidator> = Array.isArray(config.validation) ? config.validation : [ config.validation ]
    return validations.filter(validation => validation.executeOn.indexOf(ValidationExecutionStage.CHANGE))
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

  useEffect(() => {
    console.log('Setting up cleanup function...')
    return () => {
      console.log(`Cleaning up useRecoilNodeValidation state for ${storeId}...`)
      propDataStore.remove(storeId)
    }
  }, [])

  return validationResults
}

export default useRecoilNodeValidation