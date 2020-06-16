import React, { createContext, useContext, useState } from 'react';
import { Service, ValidationResult } from "microo-core";

interface ValidationResultsProviderProps {
  children: any
}

type UseValidationResults = [
  Array<ValidationResult>,
  { [propertyPath: string]: Array<ValidationResult> },
  (results: Array<ValidationResult>) => void
];

const Context = createContext<UseValidationResults | null>(null);

let isInitialised = false;

export function useValidationResults(): UseValidationResults {
  const context = useContext(Context);
  if(context !== null) return context;
  const [ validationResults, setValidationResults ] = useState<Array<ValidationResult>>([]);
  return [ validationResults, {}, setValidationResults];
}

export default function ValidationResultsProvider({ children }: ValidationResultsProviderProps) {
  const [validationResults, setValidationResults] = useState<Array<ValidationResult>>([]);
  const cache = validationResults.reduce<{ [propertyPath: string]: Array<ValidationResult> }>((a, c) => {
    if(!c.dataPaths || !c.dataPaths.length) return a;
    c.dataPaths.forEach(dataPath => {
      if(!a[dataPath]) a[dataPath] = [];
      a[dataPath].push(c);
    });
    return a;
  }, {});
  isInitialised = true;
  return (
    <Context.Provider value={[ validationResults, cache, setValidationResults ]}>
      {children}
    </Context.Provider>
  );

}