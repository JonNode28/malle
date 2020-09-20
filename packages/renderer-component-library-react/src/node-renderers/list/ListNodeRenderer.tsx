import React from 'react'
import { NodeRendererProps } from "microo-core";
import { nodeRendererStore } from "malle-renderer-react";

export default function ListNodeRenderer(
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
          if(!config.children || !config.children.length) return (
            <div>
              No items in list
            </div>
          )
          if(config.children.length > 1) throw new Error('Only one child list type is currently supported')
          const childConfig = config.children[0]
          const childRendererRegistration = nodeRendererStore.get(childConfig.type)
          if(!childRendererRegistration) return null
          const ChildTypeRenderer = childRendererRegistration.renderer
          if(!nodeData || !nodeData.length) return null

          return nodeData.map((itemData: any, i: number) => {
            return <ChildTypeRenderer
              key={i}
              config={childConfig}
              ancestryConfig={[...ancestryConfig, childConfig ]}
              jsonPointer={`${jsonPointer}/${i}`}
              originalNodeData={itemData}
              DataProvider={DataProvider}
              ErrorDisplayComponent={ErrorDisplayComponent} />
          })
        }}
      </DataProvider>

    </div>
  )
}