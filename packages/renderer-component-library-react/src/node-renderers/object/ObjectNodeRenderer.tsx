import React, { useMemo } from "react";
import s from './ObjectNodeRenderer.pcss'
import { NodeConfig, NodeRendererProps, ValidationResult } from "microo-core";
import { nodeRendererStore } from "malle-renderer-react";
import ptr from 'json-pointer'
import { createDefault } from "malle-renderer-react";

export default function ObjectNodeRenderer(
  {
    config,
    ancestryConfig,
    jsonPointer,
    nodeData,
    validationResults,
    DataProvider,
    ErrorDisplayComponent
  }: NodeRendererProps
) {
  if (!nodeData) nodeData = createDefault(config, '')
  return (
    <div>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p>{config.description}</p>}
      <div>
        {config.children && config.children.map((childConfig, i) => {
          const childRendererRegistration = nodeRendererStore.get(childConfig.type)
          if (!childRendererRegistration) return null
          const ChildTypeRenderer = childRendererRegistration.renderer
          const childJsonPointer = `${jsonPointer}/${childConfig.id}`
          return (

            <DataProvider
              key={i}
              config={childConfig}
              originalNodeData={ptr.get(nodeData, childJsonPointer)}
              jsonPointer={jsonPointer}>
              {({nodeData, setNodeDataValue, validationResults}) => {
                return (
                  <DefaultPropertyWrapper config={childConfig} key={childConfig.id}>
                    <ChildTypeRenderer
                      config={childConfig}
                      ancestryConfig={[ ...ancestryConfig, childConfig ]}
                      jsonPointer={childJsonPointer}
                      options={childRendererRegistration.options}
                      nodeData={nodeData}
                      setNodeDataValue={setNodeDataValue}
                      validationResults={validationResults}
                      DataProvider={DataProvider}
                      ErrorDisplayComponent={ErrorDisplayComponent}/>
                  </DefaultPropertyWrapper>
                )
              }}
            </DataProvider>
          )
        })}
        {validationResults && validationResults.map((result, i) => (
          <div className={s.error} key={i}>{result.errorMessage}</div>
        ))}
      </div>
    </div>
  );
}

interface DefaultPropertyWrapperProps {
  config: NodeConfig
  children: any
}

function DefaultPropertyWrapper(
  {
    config,
    children
  }: DefaultPropertyWrapperProps
) {
  return (

    <div>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p>{config.description}</p>}
      {children}
    </div>
  )
}