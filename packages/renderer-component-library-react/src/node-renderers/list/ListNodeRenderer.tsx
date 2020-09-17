import React from 'react'
import s from './ListNodeRenderer.pcss'
import { NodeRendererProps } from "microo-core";
import { nodeRendererStore } from "malle-renderer-react";
import ptr from 'json-pointer'

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
          if(!config.children || !config.children.length) return null
          if(config.children.length > 1) throw new Error('Only one child list type is currently supported')
          const childConfig = config.children[0]
          const ChildTypeRenderer = nodeRendererStore.get(childConfig.type)
          if(!nodeData || !nodeData.length) return null

          return nodeData.map((itemData: any, i: number) => {
            const childJsonPointer = `${jsonPointer}/${i}`
            return <ChildTypeRenderer
              key={childConfig.id}
              config={childConfig}
              ancestryConfig={[...ancestryConfig, childConfig ]}
              jsonPointer={childJsonPointer}
              originalNodeData={ptr.get(nodeData, childJsonPointer)}
              DataProvider={DataProvider}
              ErrorDisplayComponent={ErrorDisplayComponent} />
          })
        }}
      </DataProvider>

    </div>
  )
}