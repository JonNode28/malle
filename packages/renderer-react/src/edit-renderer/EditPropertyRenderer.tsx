import ErrorBoundary from "../error-boundary";
import { isPropertyConfig } from "../util/editDisplayConfig";
import { getProp, queryProp } from "../util/propertyConfig";
import typeRendererStore from "../store/typeRendererStore";
import { getPropertyJsonPointer } from "..";
import ptr from "json-pointer";
import RecoilPropertyDataProvider from "./RecoilPropertyDataProvider";
import React, { ComponentType } from "react";
import { EditDisplayConfig, ModelConfig } from "microo-core";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";

interface EditPropertyRendererProps {
  modelConfig: ModelConfig
  itemDisplayConfig: EditDisplayConfig
  startingPropData: any
  ErrorDisplayComponent: ComponentType<ErrorRendererProps>
}

export default function EditPropertyRenderer(
  {
    modelConfig,
    startingPropData,
    itemDisplayConfig,
    ErrorDisplayComponent
  }: EditPropertyRendererProps
){
  try {
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
          const TypeRenderer = typeRendererStore.getPropertyTypeRenderer(itemDisplayConfig.typeRenderer || matchingProp.type)
          const propertyConfig = getProp(itemDisplayConfig.options.property, modelConfig.properties);
          return (
            <RecoilPropertyDataProvider
              modelConfig={modelConfig}
              propertyConfig={propertyConfig}
              startingPropData={startingPropData}
            >
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
}