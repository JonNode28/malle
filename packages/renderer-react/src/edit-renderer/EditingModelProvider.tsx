import React, { createContext, useContext, useState } from 'react';
import { Service, ValidationResult } from "microo-core";

interface EditingModelProviderProps {
  children: any
}

type UseEditingModel = [
  any,
  (editingModel: any) => void
];

const Context = createContext<UseEditingModel | null>(null);

let isInitialised = false;

export function useEditingModel(id: string | number | null): UseEditingModel {
  const context = useContext(Context);
  if(context !== null) return context;
  const [ editingModel, setEditingModel ] = useState<any>();
  return [ editingModel, setEditingModel];
}

export default function EditingModelProvider({ children }: EditingModelProviderProps) {
  const [validationResults, setValidationResults] = useState<any>();
  isInitialised = true;
  return (
    <Context.Provider value={[ validationResults, setValidationResults ]}>
      {children}
    </Context.Provider>
  );

}