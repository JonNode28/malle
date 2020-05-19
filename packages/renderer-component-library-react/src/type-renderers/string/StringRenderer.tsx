import React from "react";
import {TypeRendererProps} from "malle-renderer-react";
import { PropertyTypeRendererProps } from "malle-renderer-react";
import s from './StringRenderer.pcss'

export default function StringRenderer({ data, propertyConfig, onChange, validationResults }: PropertyTypeRendererProps){
  if(!propertyConfig) throw Error(`propertyConfig argument is required`);
  if(!onChange) throw new Error(`onChange argument is required`);
  return (
    <div>
      <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
      {propertyConfig.description && <p>{propertyConfig.description}</p>}
      <input
        type='text'
        id={propertyConfig.id}
        value={data[propertyConfig.id]}
        data-testid='string-input'
        onChange={(e) => {
          onChange && onChange({
            ...data,
            [propertyConfig.id]: e.currentTarget.value
          });
        }} />
      {validationResults && validationResults.map((result, i) => (
        <div className={s.error} key={i}>{result.errorMessage}</div>
      ))}
    </div>
  );
}