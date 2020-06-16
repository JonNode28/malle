import React from 'react';
import { useValidationResults } from "./ValidationResultsProvider";
import s from './ValidationSummary.pcss';

export default function ValidationResults(){
  const [ validationResults ] = useValidationResults();
  
  return (
    <div className={s.validationResults}>
      {validationResults.map(result => (
        <div className={s.validationResultItem}>{result.errorMessage}</div>
      ))}
    </div>
  )
}