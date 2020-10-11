import React from "react";
import { NodeConfig, NodeRendererProps } from "microo-core";
import { nodeRendererStore } from "malle-renderer-react";
import { createDefault, useNodeData } from "malle-renderer-react";
import s from './ObjectNodeRenderer.pcss'

export default function ObjectNodeRenderer(
  {
    config,
    ancestorConfigs,
    originalNodeData,
    index,
    committed,
    ErrorDisplayComponent
  }: NodeRendererProps
) {
  if (!originalNodeData) originalNodeData = createDefault(config, {})
  useNodeData(config, ancestorConfigs, originalNodeData, committed, index)
  return (
    <div className={s.objectNodeRenderer}>
      {config.children && config.children.map((childConfig, i) => {
        const childRendererRegistration = nodeRendererStore.get(childConfig.type)
        if (!childRendererRegistration) return null
        const ChildTypeRenderer = childRendererRegistration.renderer
        return (
          <DefaultPropertyWrapper config={childConfig} key={childConfig.id}>
            <ChildTypeRenderer
              committed={committed}
              config={childConfig}
              ancestorConfigs={[ ...ancestorConfigs, childConfig ]}
              originalNodeData={originalNodeData[childConfig.id]}
              options={childRendererRegistration.options}
              ErrorDisplayComponent={ErrorDisplayComponent} />
          </DefaultPropertyWrapper>
        )
      })}
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

    <div className={s.defaultWrapper}>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p className={s.description}>{config.description}</p>}
      {children}
    </div>
  )
}