import React from 'react'
import { NodeConfig, NodeRendererProps } from "microo-core";
import { nodeRendererStore, createDefault } from "malle-renderer-react";

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
  if(!originalNodeData) originalNodeData = createDefault(config, [])
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
          const childAncestryConfig = [...ancestryConfig, childConfig ]
          return (
            <>
              <div className='list'>
                {nodeData.map((itemData: any, i: number) => {
                  return (
                    <DefaultExistingItemWrapper key={i}>
                      <ChildTypeRenderer
                        config={childConfig}
                        ancestryConfig={childAncestryConfig}
                        jsonPointer={`${jsonPointer}/${i}`}
                        originalNodeData={itemData}
                        DataProvider={DataProvider}
                        ErrorDisplayComponent={ErrorDisplayComponent} />
                    </DefaultExistingItemWrapper>
                  )
                })}
              </div>
              <DefaultNewItemWrapper config={config} onAdd={() => {
                const newArr = [ ...nodeData, ]
                setNodeDataValue(newArr)
              }}>
                <ChildTypeRenderer
                  config={childConfig}
                  ancestryConfig={childAncestryConfig}
                  jsonPointer={`${jsonPointer}/new`}
                  DataProvider={DataProvider}
                  ErrorDisplayComponent={ErrorDisplayComponent} />
              </DefaultNewItemWrapper>
            </>
          )
        }}
      </DataProvider>

    </div>
  )
}

interface DefaultExistingItemWrapperProps {
  children: any
}

function DefaultExistingItemWrapper(
  {
    children
  }: DefaultExistingItemWrapperProps
){
  return (

    <div>
      {children}
    </div>
  )
}

interface DefaultNewItemWrapperProps {
  config: NodeConfig
  onAdd: () => void
  children: any
}

function DefaultNewItemWrapper(
  {
    config,
    onAdd,
    children
  }: DefaultNewItemWrapperProps
){
  return (

    <div>
      {children}
      <button type='button' onClick={onAdd}>Add [+]</button>
    </div>
  )
}