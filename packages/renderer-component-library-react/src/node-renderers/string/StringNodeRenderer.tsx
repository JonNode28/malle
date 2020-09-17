import React, { useMemo } from "react";
import { PropertyTypeRendererProps } from "malle-renderer-react";
import s from './StringNodeRenderer.pcss'
import { NodeRendererProps } from "microo-core";

export default function StringNodeRenderer(
  {
    config,
    ancestryConfig,
    jsonPointer,
    originalNodeData,
    DataProvider,
    ErrorDisplayComponent
  }: NodeRendererProps
){
  return (
    <div>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p>{config.description}</p>}
      <DataProvider
        config={config}
        originalNodeData={originalNodeData}
        jsonPointer={jsonPointer} >
        {({nodeData, setNodeDataValue, validationResults}) => {
          return (
            <>
              <input
                type='text'
                id={config.id}
                value={nodeData}
                data-testid='string-input'
                onChange={(e) => {
                  setNodeDataValue && setNodeDataValue(e.currentTarget.value);
                }} />
              {validationResults && validationResults.map((result, i) => (
                <div className={s.error} key={i}>{result.errorMessage}</div>
              ))}
            </>
          )
        }}
      </DataProvider>

    </div>
  );
}