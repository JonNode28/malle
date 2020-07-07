import React, { ComponentType, useEffect, useState } from "react";
import s from './EditRenderer.pcss';
import { expand, isPropertyConfig } from "../util/editDisplayConfig";
import { getItemId, isEmpty } from "../util/id";
import { getProp, queryProp } from "../util/propertyConfig";
import { createNewInstance, getPropStateMap } from "../util/model";
import { TypeRendererProps } from "./TypeRendererProps";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import ErrorBoundary from "../error-boundary";
import { useService } from "../data-provider/DataProvider";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import DefaultError from "../default-error";
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
  ModelConfig, PropertyConfig,
  PropertyValidator,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import { useValidationResults } from "./ValidationResultsProvider";
import RecoilPropertyDataProvider from "./RecoilPropertyDataProvider";

export interface EditRendererProps {
  config: ModelConfig
  id?: string | number
  typeRenderers?: { [typeId: string]: ComponentType<TypeRendererProps> }
  propertyTypeRenderers?: { [typeId: string]: ComponentType<PropertyTypeRendererProps> }
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
}

export default function EditRenderer(
  {
    config,
    id,
    typeRenderers,
    propertyTypeRenderers,
    errorRenderer,
    onSaved,
    cancel
  }: EditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!config) return <ErrorDisplayComponent err={new Error('Model configuration is required')}/>;
  if(!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')} />;

  const service = useService();

  const isNew = isEmpty(id);
  const [ propStateMap, setPropStateMap ] = useState<{ [ jsonPointer: string ]: RecoilState<any> } | null>(null);

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();
  let [ validationResults, validationResultsCache, setValidationResults ] = useValidationResults();

  useEffect(() => {
    (async () => {
      if (isEmpty(id)) {
        const newInstance = (createNewInstance(config));
        setPropStateMap(getPropStateMap(config, newInstance));
        setLoading(false);
      } else {
        try {
          const getResult = await service.get(config.id, id);
          setLoading(false);
          if (!getResult.item) {
            setError(new Error(`Couldn't find a ${config.name} with ID '${id}'`));
            return;
          }
          setPropStateMap(getPropStateMap(config, getResult.item));
        } catch (err) {
          console.error(err);
          setLoading(false);
          setError(new Error(`There was a problem loading that ${config.name}: ${err.message}`));
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

            {propStateMap && renderFromDisplayConfig(config.display?.edit)}

          </ErrorBoundary>
          <button type='submit' data-testid='save'>Save</button>
          <button type='button' data-testid='cancel' onClick={() => cancel(config.id, id)}>Cancel</button>
        </form>

      </div>
    </RecoilRoot>
  );

  function renderFromDisplayConfig(displayConfig?: Array<EditDisplayConfig | string>): any {
    try {
       const expandedDisplayConfig = expand(displayConfig, config.properties);
      console.log(JSON.stringify(validationResults));
      return expandedDisplayConfig.map((itemDisplayConfig, i) => {
        return <ErrorBoundary key={i} errorRenderer={ErrorDisplayComponent}>
          {(() => {
            if (!itemDisplayConfig.typeRenderer) {
              throw new Error(`Somehow ${itemDisplayConfig.type} ended up without a type Renderer. Sounds like a problem with microo 🥺`);
            }

            if (isPropertyConfig(itemDisplayConfig)) {
              const matchingProp = queryProp(itemDisplayConfig.options.property, config.properties);
              if (!matchingProp) {
                throw new Error(`Couldn't find prop matching '${itemDisplayConfig.type}' display config`);
              }
              const TypeRenderer = propertyTypeRenderers && propertyTypeRenderers[itemDisplayConfig.typeRenderer || matchingProp.type];
              if (!TypeRenderer) {
                throw new Error(`No property type renderer for type '${itemDisplayConfig.typeRenderer || matchingProp.type}' of '${matchingProp.name}'. Registered property type renderers: [${Object.keys(propertyTypeRenderers || {}).join(`, `)}]`);
              }
              
              const propertyConfig = getProp(itemDisplayConfig.options.property, config.properties);
              if(propStateMap === null) throw new Error('propStateMap is required');
              return (
                <RecoilPropertyDataProvider modelConfig={config} propertyConfig={propertyConfig} propertyStateMap={propStateMap}>
                {({ propData, modelData, setPropDataValue, setModelDataValue }) => (
                  <TypeRenderer
                    propData={propData}
                    modelData={modelData}
                    setPropDataValue={setPropDataValue}
                    setModelDataValue={setModelDataValue}
                    propertyConfig={propertyConfig}
                    displayConfig={itemDisplayConfig}
                    renderChildren={renderFromDisplayConfig}
                    validationResults={validationResultsCache[propertyConfig.id]}/>
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

