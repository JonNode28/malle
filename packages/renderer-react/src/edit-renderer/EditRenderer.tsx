import React, { ComponentType, Suspense, useEffect, useState } from "react";
import s from './EditRenderer.pcss';
import { expand, isPropertyConfig } from "../util/editDisplayConfig";
import { getItemId, isEmpty } from "../util/id";
import { getProp, queryProp } from "../util/propertyConfig";
import { createNewInstance, getPropertyJsonPointer } from "../util/model";
import { TypeRendererProps } from "./TypeRendererProps";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import ErrorBoundary from "../error-boundary";
import { useService } from "../data-provider/DataProvider";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import DefaultError from "../default-error";
import ptr from 'json-pointer';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState, RecoilState,
} from 'recoil';
import {
  EditDisplayConfig,
  ModelConfig,
  PropertyConfig,
  PropertyValidator,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import RecoilPropertyDataProvider from "./RecoilPropertyDataProvider";

export interface EditRendererProps {
  modelConfig: ModelConfig
  id?: string | number
  typeRenderers?: { [typeId: string]: ComponentType<TypeRendererProps> }
  propertyTypeRenderers?: { [typeId: string]: ComponentType<PropertyTypeRendererProps> }
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
}

export default function EditRenderer(
  {
    modelConfig,
    id,
    typeRenderers,
    propertyTypeRenderers,
    errorRenderer,
    onSaved,
    cancel
  }: EditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!modelConfig) return <ErrorDisplayComponent err={new Error('Model configuration is required')}/>;
  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')}/>;

  const service = useService();

  const isNew = isEmpty(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [ startingData, setStartingData ] = useState<Object|null>(null);

  useEffect(() => {
    (async () => {
      if (isEmpty(id)) {
        const newInstance = (createNewInstance(modelConfig));
        setStartingData(newInstance)
        setLoading(false);
      } else {
        try {
          const getResult = await service.get(modelConfig.id, id);
          setLoading(false);
          if (!getResult.item) {
            setError(new Error(`Couldn't find a ${modelConfig.name} with ID '${id}'`));
            return;
          }
          setStartingData(getResult.item)
        } catch (err) {
          console.error(err);
          setLoading(false);
          setError(new Error(`There was a problem loading that ${modelConfig.name}: ${err.message}`));
          return;
        }
      }
    })()
  }, [id]);

  // async function save(){
  //   const executionStage = isNew ? ValidationExecutionStage.CLIENT_CREATE : ValidationExecutionStage.CLIENT_UPDATE;
  //   let validationResults: Array<ValidationResult> = [];
  //
  //   for(const propertyConfig of config.properties){
  //     if(!propertyConfig.validation) continue;
  //     const validators = Array.isArray(propertyConfig.validation) ? propertyConfig.validation : [ propertyConfig.validation ];
  //     const relevantValidators = validators.filter(validator => validator.executeOn.indexOf(executionStage) !== -1);
  //     if(!relevantValidators.length) continue;
  //     validationResults = validationResults.concat(await Promise.all(relevantValidators.map(validator =>
  //       validator.execute(executionStage, propertyConfig, config, originalModelData))));
  //   }
  //
  //   const valid = !validationResults.some(result => result.valid);
  //
  //   setValidationResults(validationResults);
  //
  //   if(!valid) return;
  //
  //   await service.save(config.id, originalModelData);
  //   if (onSaved) onSaved(config.id, originalModelData);
  // }

  return (
    <RecoilRoot>
      <div className={s.editRenderer}>

        {error && <ErrorDisplayComponent err={error}/>}

        {loading && <div className={s.editRenderer} data-testid='loading'>loading...</div>}

        <form onSubmit={e => {
          e.preventDefault();
          //save()
        }} data-testid='form'>
          <ErrorBoundary errorRenderer={ErrorDisplayComponent}>

            {startingData && renderFromDisplayConfig(modelConfig.display?.edit)}

          </ErrorBoundary>
          <button type='submit' data-testid='save'>Save</button>
          <button type='button' data-testid='cancel' onClick={() => cancel(modelConfig.id, id)}>Cancel</button>
        </form>

      </div>
    </RecoilRoot>
  );

  function renderFromDisplayConfig(displayConfig?: Array<EditDisplayConfig | string>): any {
    if(!startingData) return
    try {
      const expandedDisplayConfig = expand(displayConfig, modelConfig.properties);
      return expandedDisplayConfig.map((itemDisplayConfig, i) => {
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
                  startingPropData={startingPropData} >
                  {({propData, modelData, setPropDataValue, setModelDataValue, validationResults}) => (
                    <TypeRenderer
                      propertyConfig={propertyConfig}
                      modelConfig={modelConfig}
                      displayConfig={itemDisplayConfig}
                      propData={propData}
                      modelData={modelData}
                      setPropDataValue={setPropDataValue}
                      setModelDataValue={setModelDataValue}
                      renderChildren={renderFromDisplayConfig}
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
                displayConfig={itemDisplayConfig}
                renderChildren={renderFromDisplayConfig}/>
            }
          })()}
        </ErrorBoundary>
      });
    } catch (err) {
      console.error(err);
      return <ErrorDisplayComponent err={err}/>
    }
  }

}

