import React from 'react'
import s from './ListRenderer.pcss'
import { PropertyTypeRendererProps } from "malle-renderer-react";

export default function ListRenderer(
  {
    propertyConfig,
    modelConfig,
    propData,
    modelData,
    setPropDataValue,
    setModelDataValue,
    validationResults
  }: PropertyTypeRendererProps
){
  return (
    <div className={s.listRenderer}>
      List!
    </div>
  )
}