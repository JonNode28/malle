import React, { useMemo, useState } from 'react'
import { NodeConfig, NodeRendererProps } from "microo-core";
import { nodeRendererStore, createDefault } from "malle-renderer-react";
import { v4 } from 'uuid'

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
  if(!Array.isArray(nodeData)) throw new Error(`'${config.type}' renderer only works with arrays`)
  if (!config.children || !config.children.length) throw new Error(`'${config.type}' renderer must have at least one child config`)
  if (config.children.length > 1) throw new Error('Only one child list type is currently supported')

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) return null
  const ChildTypeRenderer = childRendererRegistration.renderer
  const childAncestryConfig = [ ...ancestryConfig, childConfig ]

  const originalChildItems = useMemo(() => {
    if(!Array.isArray(nodeData)) throw new Error(`'${config.type}' renderer only works with arrays`)
    return nodeData.map(originalItemData => ({
      id: v4() as string,
      originalItemData
    }))
  }, [])

  const [ childItems, setChildItems ] = useState(originalChildItems)





  return (
    <div>
      <div className='list'>
        {childItems && childItems.map((item: any, i: number) => {
          const childJsonPointer = `${jsonPointer}/${i}`
          return (
            <DataProvider
              key={item.id}
              id={item.id}
              config={config}
              originalNodeData={item.originalItemData}
              jsonPointer={childJsonPointer}>
              {(dataProps) => {
                return (
                  <DefaultExistingItemWrapper onRemove={() => {
                    setChildItems(childItems.filter(childItem => childItem.id !== item.id))
                  }}>
                    <ChildTypeRenderer
                      {...dataProps}
                      config={childConfig}
                      ancestryConfig={childAncestryConfig}
                      jsonPointer={childJsonPointer}
                      DataProvider={DataProvider}
                      ErrorDisplayComponent={ErrorDisplayComponent} />
                  </DefaultExistingItemWrapper>
                )
              }}
            </DataProvider>
          )
        })}
      </div>

      <DataProvider
        config={childConfig}
        id={v4()}
        originalNodeData={createDefault(childConfig)}
        jsonPointer={jsonPointer}>
        {(dataProps) => {
          return (
            <DefaultNewItemWrapper config={config} onAdd={() => {
              setChildItems([...childItems, {
                id: v4() as string,
                originalItemData: dataProps.nodeData
              }])
            }}>
              <ChildTypeRenderer
                {...dataProps}
                config={childConfig}
                ancestryConfig={childAncestryConfig}
                jsonPointer={`${jsonPointer}/new`}
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