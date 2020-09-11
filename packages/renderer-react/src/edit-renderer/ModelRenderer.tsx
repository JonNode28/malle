import { EditDisplayConfig, ModelConfig } from "microo-core";
import React, { ComponentType } from "react";
import { TypeRendererProps } from "./TypeRendererProps";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import { expand, isPropertyConfig } from "../util/editDisplayConfig";
import ErrorBoundary from "../error-boundary";
import { getProp, queryProp } from "../util/propertyConfig";
import { getPropertyJsonPointer } from "..";
import ptr from "json-pointer";
import RecoilPropertyDataProvider from "./RecoilPropertyDataProvider";

interface ModelRendererProps {
  modelConfig: ModelConfig
  typeRenderers?: { [typeId: string]: ComponentType<TypeRendererProps> }
  propertyTypeRenderers?: { [typeId: string]: ComponentType<PropertyTypeRendererProps> }
  startingData: any
  ErrorDisplayComponent: ComponentType<ErrorRendererProps>
}
export default function ModelRenderer(
  {
    modelConfig,
    typeRenderers,
    propertyTypeRenderers,
    startingData,
    ErrorDisplayComponent
  }: ModelRendererProps
): JSX.Element | null{
  if (!startingData) return null
  try {
    const expandedDisplayConfig = expand(modelConfig.display?.edit, modelConfig.properties);


    return <div>
      {expandedDisplayConfig.map((itemDisplayConfig, i) => {
        return <ErrorBoundary key={i} errorRenderer={ErrorDisplayComponent}>
          {(() => {
            if (!itemDisplayConfig.typeRenderer) {
              throw new Error(`Somehow ${itemDisplayConfig.type} ended up without a type Renderer. Sounds like a problem with microo 🥺`);
            }

            if (isPropertyConfig(itemDisplayConfig)) {
              const matchingProp = queryProp(itemDisplayConfig.options.property, modelConfig.properties);
              if (!matchingProp) {
                throw new Error(`Couldn't find prop matching '${itemDisplayConfig.type}' display config`);
              }
              const TypeRenderer = propertyTypeRenderers && propertyTypeRenderers[itemDisplayConfig.typeRenderer || matchingProp.type];
              if (!TypeRenderer) {
                throw new Error(`No property type renderer for type '${itemDisplayConfig.typeRenderer || matchingProp.type}' of '${matchingProp.name}'. Registered property type renderers: [${Object.keys(propertyTypeRenderers || {}).join(`, `)}]`);
              }

              const propertyConfig = getProp(itemDisplayConfig.options.property, modelConfig.properties);
              const jsonPointer = getPropertyJsonPointer(propertyConfig)
              const startingPropData = ptr.get(startingData, jsonPointer)
              return (
                <RecoilPropertyDataProvider
                  modelConfig={modelConfig}
                  propertyConfig={propertyConfig}
                  startingPropData={startingPropData}>
                  {({propData, modelData, setPropDataValue, setModelDataValue, validationResults}) => (
                    <TypeRenderer
                      propertyConfig={propertyConfig}
                      modelConfig={modelConfig}
                      displayConfig={itemDisplayConfig}
                      propData={propData}
                      modelData={modelData}
                      setPropDataValue={setPropDataValue}
                      setModelDataValue={setModelDataValue}
                      validationResults={validationResults}/>
                  )}
                </RecoilPropertyDataProvider>
              );
            } else {
              const TypeRenderer = typeRenderers && typeRenderers[itemDisplayConfig.type];
              if (!TypeRenderer) {
                throw new Error(`No type renderer for display type '${itemDisplayConfig.type}'. Registered type renderers: [${Object.keys(typeRenderers || {}).join(`, `)}]`);
              }
              return <TypeRenderer
                displayConfig={itemDisplayConfig}/>
            }
          })()}
      </ErrorBoundary>
    })}
    </div>
  } catch (err) {
    console.error(err);
    return <ErrorDisplayComponent err={err}/>
  }
}