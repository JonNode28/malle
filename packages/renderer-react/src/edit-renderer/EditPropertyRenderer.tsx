import ErrorBoundary from "../error-boundary";
import { isPropertyConfig } from "../util/editDisplayConfig";
import { getProp, queryProp } from "../util/propertyConfig";
import { DisplayTypeRendererProps, getPropertyJsonPointer, PropertyTypeRendererProps } from "..";
import ptr from "json-pointer";
import RecoilPropertyDataProvider from "./RecoilPropertyDataProvider";
import React, { ComponentType } from "react";
import { EditDisplayConfig, ModelConfig } from "microo-core";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import DefaultError from "../default-error";

interface EditPropertyRendererProps {
  modelConfig: ModelConfig
  itemDisplayConfig: EditDisplayConfig
  startingPropData: any
  errorRenderer: ComponentType<ErrorRendererProps> | null
  displayTypeRenderers: { [typeId: string]: ComponentType<DisplayTypeRendererProps> }
  propertyTypeRenderers: { [typeId: string]: ComponentType<PropertyTypeRendererProps> }
}

export default function EditPropertyRenderer(
  {
    modelConfig,
    startingPropData,
    itemDisplayConfig,
    errorRenderer,
    displayTypeRenderers,
    propertyTypeRenderers
  }: EditPropertyRendererProps
){
  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  try{
    return (
      <ErrorBoundary errorRenderer={ErrorDisplayComponent}>
      {(() => {
        if (!itemDisplayConfig.typeRenderer) {
          throw new Error(`Somehow ${itemDisplayConfig.type} ended up without a type Renderer. Sounds like a problem with microo 🥺`);
        }

        if (isPropertyConfig(itemDisplayConfig)) {
          const matchingProp = queryProp(itemDisplayConfig.options.property, modelConfig.properties);
          if (!matchingProp) {
            throw new Error(`Couldn't find prop matching '${itemDisplayConfig.type}' display config`);
          }
          const typeId = itemDisplayConfig.typeRenderer || matchingProp.type
          const TypeRenderer = propertyTypeRenderers[typeId]
          if(!TypeRenderer){
            throw new Error(`No '${typeId}' property type renderer registered`)
          }
          const propertyConfig = getProp(itemDisplayConfig.options.property, modelConfig.properties);
          return (
            <RecoilPropertyDataProvider
              modelConfig={modelConfig}
              propertyConfig={propertyConfig}
              startingPropData={startingPropData}
            >
              {(
                {
                  propData,
                  modelData,
                  setPropDataValue,
                  setModelDataValue,
                  validationResults
                }
              ) => (
                <TypeRenderer
                  propertyConfig={propertyConfig}
                  modelConfig={modelConfig}
                  displayConfig={itemDisplayConfig}
                  propData={propData}
                  modelData={modelData}
                  setPropDataValue={setPropDataValue}
                  setModelDataValue={setModelDataValue}
                  validationResults={validationResults}
                  errorRenderer={ErrorDisplayComponent}
                  displayTypeRenderers={displayTypeRenderers}
                  propertyTypeRenderers={propertyTypeRenderers} />
              )}
            </RecoilPropertyDataProvider>
          );
        } else {
          const TypeRenderer = displayTypeRenderers[itemDisplayConfig.type]
          if(!TypeRenderer){
            throw new Error(`No '${itemDisplayConfig.type}' display type renderer registered`)
          }
          return <TypeRenderer
            displayConfig={itemDisplayConfig}/>
        }
      })()}
    </ErrorBoundary>
  )
  } catch(err) {
    console.error(err)
    return <ErrorDisplayComponent err={err} />
  }
}