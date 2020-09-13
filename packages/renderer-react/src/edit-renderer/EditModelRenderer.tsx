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
import EditPropertyRenderer from "./EditPropertyRenderer";

interface ModelRendererProps {
  modelConfig: ModelConfig
  startingData: any
  ErrorDisplayComponent: ComponentType<ErrorRendererProps>
}
export default function EditModelRenderer(
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
        const propertyConfig = getProp(itemDisplayConfig.options.property, modelConfig.properties);
        const jsonPointer = getPropertyJsonPointer(propertyConfig)
        const startingPropData = ptr.has(startingData, jsonPointer) ? ptr.get(startingData, jsonPointer) : null
        return <EditPropertyRenderer
          modelConfig={modelConfig}
          itemDisplayConfig={itemDisplayConfig}
          startingPropData={startingPropData}
          ErrorDisplayComponent={ErrorDisplayComponent}/>
      })}
    </div>
  } catch (err) {
    console.error(err);
    return <ErrorDisplayComponent err={err}/>
  }
}