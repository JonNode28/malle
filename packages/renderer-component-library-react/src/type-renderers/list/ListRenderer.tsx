import React from 'react'
import s from './ListRenderer.pcss'
import { PropertyTypeRendererProps } from "malle-renderer-react";
import { EditPropertyRenderer } from "malle-renderer-react";
import { propDataStore } from "malle-renderer-react";
import { useRecoilState } from "recoil";

export default function ListRenderer(
  {
    propertyConfig,
    displayConfig,
    modelConfig,
    propData,
    modelData,
    setPropDataValue,
    setModelDataValue,
    validationResults,
    errorRenderer,
    displayTypeRenderers,
    propertyTypeRenderers,
  }: PropertyTypeRendererProps
){
  const PropertyTypeRenderer = propertyTypeRenderers[propertyConfig.listItemType || 'string']

  const propDataState = propDataStore.get(modelConfig.id, '/title')

  const [ recoilPropData, setRecoilPropData ] = useRecoilState(propDataState);

  console.log(recoilPropData)

  return (
    <div className={s.listRenderer}>
      {(() => {
        if(!Array.isArray(propData) || !propData.length){
          return <div>No items in the list</div>
        } else {
          return propData.map((itemData: any, i: number) => {
            return <PropertyTypeRenderer
              key={i}
              propertyConfig={propertyConfig}
              modelConfig={modelConfig}
              displayConfig={displayConfig}
              propData={propData}
              modelData={modelData}
              setPropDataValue={setPropDataValue}
              setModelDataValue={setModelDataValue}
              validationResults={validationResults}
              errorRenderer={errorRenderer}
              displayTypeRenderers={displayTypeRenderers}
              propertyTypeRenderers={propertyTypeRenderers}
              />
          })
        }
      })()}
    </div>
  )
}