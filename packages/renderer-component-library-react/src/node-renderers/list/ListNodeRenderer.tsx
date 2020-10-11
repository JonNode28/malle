import React, { useEffect, useState } from 'react'
import { NodeConfig, NodeRendererProps } from "microo-core";
import { nodeRendererStore, createDefault } from "malle-renderer-react";
import s from './ListNodeRenderer.pcss'
import { useArrayNodeData } from "malle-renderer-react";
import { nanoid } from "nanoid";

export default function ListNodeRenderer(
  {
    config,
    ancestorConfigs,
    originalNodeData,
    committed,
    index,
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
    commitItem,
  } = useArrayNodeData(config, ancestorConfigs, originalNodeData, committed, index)

  return (
    <div className={s.listNodeRenderer}>
      <div className={s.items}>
        {childIds && childIds.map((childId: any, i: number) => {
          return (
            <DefaultExistingItemWrapper key={childId} onRemove={() => {
              removeItem(i)
            }}>
              <ChildTypeRenderer
                index={i}
                committed={committed}
                originalNodeData={originalNodeData ? originalNodeData[i] : undefined}
                config={childConfig}
                ancestorConfigs={childAncestorConfigs}
                ErrorDisplayComponent={ErrorDisplayComponent} />
            </DefaultExistingItemWrapper>
          )
        })}
      </div>
      <DefaultNewItemWrapper config={config} onAdd={() => {
        commitItem(childIds.length)
      }}>
        <ChildTypeRenderer
          index={childIds.length}
          committed={false}
          config={childConfig}
          ancestorConfigs={childAncestorConfigs}
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