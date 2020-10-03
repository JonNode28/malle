import React, { useEffect, useMemo, useState } from 'react'
import { NodeConfig, NodeRendererProps } from "microo-core";
import { nodeRendererStore, createDefault } from "malle-renderer-react";
import { nanoid } from 'nanoid'
import { useArrayNodeIds } from "malle-renderer-react";

export default function ListNodeRenderer(
  {
    config,
    ancestorConfigs,
    jsonPointer,
    originalNodeData,
    ErrorDisplayComponent
  }: NodeRendererProps
) {
  if (!originalNodeData) originalNodeData = createDefault(config, [])
  if(!Array.isArray(originalNodeData)) throw new Error(`'${config.type}' renderer only works with arrays`)
  if (!config.children || !config.children.length) throw new Error(`'${config.type}' renderer must have at least one child config`)
  if (config.children.length > 1) throw new Error('Only one child list type is currently supported')

  const childConfig = config.children[0]
  const childRendererRegistration = nodeRendererStore.get(childConfig.type)
  if (!childRendererRegistration) return null
  const ChildTypeRenderer = childRendererRegistration.renderer
  const childAncestorConfigs = [ ...ancestorConfigs, config ]

  const {
    childIds,
    removeItem,
    addItem,
  } = useArrayNodeIds(config, originalNodeData)

  const [ newItemId, setNewItemId ] = useState<string>()

  useEffect(() => {
    setNewItemId(nanoid())
  }, [])
  if(!newItemId) return null
  return (
    <div>
      <div className='list'>
        {childIds && childIds.map((childId: any, i: number) => {
          const childJsonPointer = `${jsonPointer}/${i}`
          return (
            <DefaultExistingItemWrapper key={childId} onRemove={() => {
              removeItem(childId)
            }}>
              <ChildTypeRenderer
                id={childId}
                originalNodeData={originalNodeData ? originalNodeData[i] : undefined}
                config={childConfig}
                ancestorConfigs={childAncestorConfigs}
                jsonPointer={childJsonPointer}
                ErrorDisplayComponent={ErrorDisplayComponent} />
            </DefaultExistingItemWrapper>
          )
        })}
      </div>

      <DefaultNewItemWrapper config={config} onAdd={() => {
        addItem(newItemId)
        setNewItemId(nanoid())
      }}>
        <ChildTypeRenderer
          id={newItemId}
          config={childConfig}
          ancestorConfigs={childAncestorConfigs}
          jsonPointer={`${jsonPointer}/new`}
          ErrorDisplayComponent={ErrorDisplayComponent} />
      </DefaultNewItemWrapper>
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