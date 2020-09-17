import React, { useMemo } from "react";
import s from './ObjectTypeRenderer.pcss'
import { NodeRendererProps } from "microo-core";
import nodeRendererStore from "../store/nodeRendererStore";
import ptr from 'json-pointer'

export default function ObjectTypeRenderer(
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
              {config.children && config.children.map(childConfig => {
                const ChildTypeRenderer = nodeRendererStore.get(childConfig.type)
                const childJsonPointer = `${jsonPointer}/${childConfig.id}`
                console.log(childJsonPointer)
                return <ChildTypeRenderer
                  key={childConfig.id}
                  config={childConfig}
                  ancestryConfig={[...ancestryConfig, childConfig ]}
                  jsonPointer={childJsonPointer}
                  originalNodeData={ptr.get(nodeData, childJsonPointer)}
                  DataProvider={DataProvider}
                  ErrorDisplayComponent={ErrorDisplayComponent} />
              })}
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