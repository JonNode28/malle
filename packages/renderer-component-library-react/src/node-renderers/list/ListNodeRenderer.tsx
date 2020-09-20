import React from 'react'
import { NodeConfig, NodeRendererProps } from "microo-core";
import { nodeRendererStore, createDefault } from "malle-renderer-react";

export default function ListNodeRenderer(
  {
    config,
    ancestryConfig,
    jsonPointer,
    nodeData,
    setNodeDataValue,
    DataProvider,
    ErrorDisplayComponent
  }: NodeRendererProps
) {
  if (!nodeData) nodeData = createDefault(config, [])
  if (!config.children || !config.children.length) return (
    <div>
      No items in list
    </div>
  )
  if (config.children.length > 1) throw new Error('Only one child list type is currently supported')
  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) return null
  const ChildTypeRenderer = childRendererRegistration.renderer
  if (!nodeData || !nodeData.length) return null
  const childAncestryConfig = [ ...ancestryConfig, childConfig ]
  return (
    <div>
      <label htmlFor={config.id}>{config.name}</label>
      {config.description && <p>{config.description}</p>}
      <div className='list'>
        {nodeData.map((itemData: any, i: number) => {
          const childJsonPointer = `${jsonPointer}/${i}`
          return (
            <DataProvider
              config={config}
              originalNodeData={itemData}
              jsonPointer={childJsonPointer}>
              {({nodeData, setNodeDataValue, validationResults}) => {
                return (
                  <DefaultExistingItemWrapper key={i}>
                    <ChildTypeRenderer
                      config={childConfig}
                      ancestryConfig={childAncestryConfig}
                      jsonPointer={childJsonPointer}
                      nodeData={nodeData}
                      setNodeDataValue={setNodeDataValue}
                      validationResults={validationResults}
                      DataProvider={DataProvider}
                      ErrorDisplayComponent={ErrorDisplayComponent}/>
                  </DefaultExistingItemWrapper>
                )
              }}
            </DataProvider>
          )
        })}
      </div>

      <DataProvider
        config={childConfig}
        originalNodeData={createDefault}
        jsonPointer={jsonPointer}>
        {(
          {
            nodeData: newNodeData,
            setNodeDataValue: setNewNodeDataValue,
            validationResults: newValidationResults
          }) => {
          return (
            <DefaultNewItemWrapper config={config} onAdd={() => {
              const newArr = [ ...nodeData, newNodeData ]
              setNodeDataValue(newArr)
              setNewNodeDataValue('')
            }}>
              <ChildTypeRenderer
                config={childConfig}
                ancestryConfig={childAncestryConfig}
                jsonPointer={`${jsonPointer}/new`}
                nodeData={newNodeData}
                setNodeDataValue={setNewNodeDataValue}
                validationResults={newValidationResults}
                DataProvider={DataProvider}
                ErrorDisplayComponent={ErrorDisplayComponent}/>
            </DefaultNewItemWrapper>
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
) {
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
) {
  return (

    <div>
      {children}
      <button type='button' onClick={onAdd}>Add [+]</button>
    </div>
  )
}