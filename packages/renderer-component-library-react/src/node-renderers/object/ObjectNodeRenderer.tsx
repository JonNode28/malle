import React, { useMemo } from "react";
import s from './ObjectNodeRenderer.pcss'
import { NodeRendererProps } from "microo-core";
import { nodeRendererStore } from "malle-renderer-react";
import ptr from 'json-pointer'

export default function ObjectNodeRenderer(
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
            <div>
              {config.children && config.children.map(childConfig => {
                const childRendererRegistration = nodeRendererStore.get(childConfig.type)
                if(!childRendererRegistration) return null
                const ChildTypeRenderer = childRendererRegistration.renderer
                const childJsonPointer = `${jsonPointer}/${childConfig.id}`
                console.log(childJsonPointer)
                return <ChildTypeRenderer
                  key={childConfig.id}
                  config={childConfig}
                  ancestryConfig={[...ancestryConfig, childConfig ]}
                  jsonPointer={childJsonPointer}
                  options={childRendererRegistration.options}
                  originalNodeData={ptr.get(nodeData, childJsonPointer)}
                  DataProvider={DataProvider}
                  ErrorDisplayComponent={ErrorDisplayComponent} />
              })}
              {validationResults && validationResults.map((result, i) => (
                <div className={s.error} key={i}>{result.errorMessage}</div>
              ))}
            </div>
          )
        }}
      </DataProvider>

    </div>
  );
}