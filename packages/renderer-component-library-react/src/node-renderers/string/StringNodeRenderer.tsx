import React from "react";
import s from './StringNodeRenderer.pcss'
import { NodeRendererProps } from "microo-core";

function StringNodeRenderer(
  {
    config,
    ancestryConfig,
    jsonPointer,
    originalNodeData,
    DataProvider,
  }: NodeRendererProps
){
  return (
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
  );
}
StringNodeRenderer.type = 'string'
export default StringNodeRenderer