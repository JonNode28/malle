import React, { useMemo } from "react";
import s from './ObjectNodeRenderer.pcss'
import { NodeConfig, NodeRendererProps, ValidationResult } from "microo-core";
import { nodeRendererStore } from "malle-renderer-react";
import ptr from 'json-pointer'
import { createDefault, useNodeData } from "malle-renderer-react";

export default function ObjectNodeRenderer(
  {
    config,
    ancestorConfigs,
    jsonPointer,
    originalNodeData,
    ErrorDisplayComponent
  }: NodeRendererProps
) {
  if (!originalNodeData) originalNodeData = createDefault(config, {})
  useNodeData(config, originalNodeData)
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
            <DefaultPropertyWrapper config={childConfig} key={childConfig.id}>
              <ChildTypeRenderer
                id={childJsonPointer}
                config={childConfig}
                ancestorConfigs={[ ...ancestorConfigs, childConfig ]}
                jsonPointer={childJsonPointer}
                originalNodeData={ptr.get(originalNodeData, childJsonPointer)}
                options={childRendererRegistration.options}
                ErrorDisplayComponent={ErrorDisplayComponent}/>
            </DefaultPropertyWrapper>
          )
        })}
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