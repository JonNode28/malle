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
  const childAncestryConfig = [ ...ancestryConfig, childConfig ]
  return (
    <div>
      <div className='list'>
        {nodeData && nodeData.map((itemData: any, i: number) => {
          const childJsonPointer = `${jsonPointer}/${i}`
          return (
            <DataProvider
              key={childJsonPointer}
              config={config}
              originalNodeData={itemData}
              jsonPointer={childJsonPointer}>
              {(item) => {
                return (
                  <DefaultExistingItemWrapper onRemove={() => {
                    const newArr = [...nodeData]
                    newArr.splice(i, 1)
                    setNodeDataValue(newArr)
                  }}>
                    <ChildTypeRenderer
                      config={childConfig}
                      ancestryConfig={childAncestryConfig}
                      jsonPointer={childJsonPointer}
                      nodeData={item.nodeData}
                      setNodeDataValue={item.setNodeDataValue}
                      validationResults={item.validationResults}
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
        originalNodeData={createDefault(childConfig)}
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
                ErrorDisplayComponent={ErrorDisplayComponent} />
            </DefaultNewItemWrapper>
          )
        }}
      </DataProvider>

    </div>
  )
}

interface DefaultExistingItemWrapperProps {
  onRemove: () => void
  children: any
}

function DefaultExistingItemWrapper(
  {
    onRemove,
    children
  }: DefaultExistingItemWrapperProps
) {
  return (

    <div>
      {children}
      <button type='button' onClick={onRemove}>Remove [-]</button>
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