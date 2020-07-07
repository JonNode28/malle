import React, { useMemo } from "react";
import { PropertyTypeRendererProps } from "malle-renderer-react";
import s from './StringRenderer.pcss'
import { useRecoilState } from 'recoil';
import { getPropertyState } from "malle-renderer-react";
import { ValidationExecutionStage } from "microo-core";
import { useDebouncedCallback } from 'use-debounce';

export default function StringRenderer({ propertyStateMap, propertyConfig, validationResults }: PropertyTypeRendererProps){
  const [ propData, setPropData ] = useRecoilState<any>(getPropertyState(propertyStateMap, propertyConfig));

  const onChangeValidations = useMemo(() => {
    if(!propertyConfig.validation) return [];
    if(Array.isArray(propertyConfig.validation)) return propertyConfig.validation.filter(validation => validation.executeOn.indexOf(ValidationExecutionStage.CHANGE))
    return propertyConfig.validation.executeOn.indexOf(ValidationExecutionStage.CHANGE) ? [ propertyConfig.validation ] : null
  }, []);

  const [ debouncedValidate ] = useDebouncedCallback(() => {

  }, 500);

  //const validationResults = onChangeValidations.map(validation => validation.execute(ValidationExecutionStage.CHANGE, propertyConfig, modelConfig, ))

  return (
    <div>
      <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
      {propertyConfig.description && <p>{propertyConfig.description}</p>}
      <input
        type='text'
        id={propertyConfig.id}
        value={propData}
        data-testid='string-input'
        onChange={(e) => {
          setPropData && setPropData(e.currentTarget.value);
        }} />
      {validationResults && validationResults.map((result, i) => (
        <div className={s.error} key={i}>{result.errorMessage}</div>
      ))}
    </div>
  );
}