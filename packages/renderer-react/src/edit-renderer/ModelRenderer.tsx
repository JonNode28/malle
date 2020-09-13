import { EditDisplayConfig, ModelConfig } from "microo-core";
import React, { ComponentType } from "react";
import { DisplayTypeRendererProps } from "./DisplayTypeRendererProps";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import { expand, isPropertyConfig } from "../util/editDisplayConfig";
import ErrorBoundary from "../error-boundary";
import { getProp, queryProp } from "../util/propertyConfig";
import { getPropertyJsonPointer } from "../util/model";
import ptr from "json-pointer";
import RecoilPropertyDataProvider from "./RecoilPropertyDataProvider";
import typeRendererStore from "../store/typeRendererStore";

interface ModelRendererProps {
  modelConfig: ModelConfig
  startingData: any
  ErrorDisplayComponent: ComponentType<ErrorRendererProps>
}
export default function ModelRenderer(
  {
    modelConfig,
    startingData,
    ErrorDisplayComponent
  }: ModelRendererProps
): JSX.Element | null{
  if (!startingData) return null
  try {
    const expandedDisplayConfig = expand(modelConfig.display?.edit, modelConfig.properties);

    return <div>
      {expandedDisplayConfig.map((itemDisplayConfig, i) => {
        try {
          return (
            <ErrorBoundary key={i} errorRenderer={ErrorDisplayComponent}>
              {(() => {
                if (!itemDisplayConfig.typeRenderer) {
                  throw new Error(`Somehow ${itemDisplayConfig.type} ended up without a type Renderer. Sounds like a problem with microo 🥺`);
                }

                if (isPropertyConfig(itemDisplayConfig)) {
                  const matchingProp = queryProp(itemDisplayConfig.options.property, modelConfig.properties);
                  if (!matchingProp) {
                    throw new Error(`Couldn't find prop matching '${itemDisplayConfig.type}' display config`);
                  }
                  const TypeRenderer = typeRendererStore.getPropertyTypeRenderer(itemDisplayConfig.typeRenderer || matchingProp.type)
                  const propertyConfig = getProp(itemDisplayConfig.options.property, modelConfig.properties);
                  const jsonPointer = getPropertyJsonPointer(propertyConfig)
                  const startingPropData = ptr.has(startingData, jsonPointer) ? ptr.get(startingData, jsonPointer) : null
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
                          validationResults={validationResults} />
                      )}
                    </RecoilPropertyDataProvider>
                  );
                } else {
                  const TypeRenderer = typeRendererStore.getDisplayTypeRenderer(itemDisplayConfig.type)
                  return <TypeRenderer
                    displayConfig={itemDisplayConfig}/>
                }
              })()}
            </ErrorBoundary>
          )
        } catch(err) {
          return <ErrorDisplayComponent err={err} />
        }


    })}
    </div>
  } catch (err) {
    console.error(err);
    return <ErrorDisplayComponent err={err}/>
  }
}