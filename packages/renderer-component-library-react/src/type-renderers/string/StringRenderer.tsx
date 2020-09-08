import React, { useMemo } from "react";
import { PropertyTypeRendererProps } from "malle-renderer-react";
import s from './StringRenderer.pcss'

export default function StringRenderer(
  {
    propertyConfig,
    modelConfig,
    propData,
    modelData,
    setPropDataValue,
    setModelDataValue,
    validationResults
  }: PropertyTypeRendererProps
){
  return (
    <div>
      <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
      {propertyConfig.description && <p>{propertyConfig.description}</p>}
      <input
        type='text'
        id={propertyConfig.id}
        defaultValue={propData}
        data-testid='string-input'
        onChange={(e) => {
          setPropDataValue && setPropDataValue(e.currentTarget.value);
        }} />
      {validationResults && validationResults.map((result, i) => (
        <div className={s.error} key={i}>{result.errorMessage}</div>
      ))}
    </div>
  );
}