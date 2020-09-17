import React, { ComponentType, Suspense, useEffect, useState } from "react";
import s from './EditRenderer.pcss';
import { expand, isPropertyConfig } from "../util/editDisplayConfig";
import { getItemId, isEmpty } from "../util/id";
import { getProp, queryProp } from "../util/propertyConfig";
import { createNewInstance, createNewInstanceFromNodeConfig, getPropertyJsonPointer } from "../util/model";
import { DisplayTypeRendererProps } from "./DisplayTypeRendererProps";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import { useService } from "../data-provider/DataProvider";
import {  } from "microo-core";
import DefaultError from "../default-error";
import ptr from 'json-pointer';
import {
  RecoilRoot, useRecoilCallback,
} from 'recoil';
import {
  EditDisplayConfig,
  ModelConfig,
  NodeConfig,
  PropertyConfig,
  PropertyValidator,
  ValidationExecutionStage,
  ValidationResult,
  ErrorRendererProps
} from "microo-core";
import modelDataStore from "../store/modelDataStore";
import EditModelRenderer from "./EditModelRenderer";
import nodeRendererStore from "../store/nodeRendererStore";
import { NodeRendererProps } from "microo-core";
import RecoilNodeDataProvider from "./RecoilNodeDataProvider";

export interface EditRendererProps {
  config: NodeConfig
  editingId?: string | number
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  typeRenderers: { [typeId: string]: ComponentType<NodeRendererProps> }
}

export default function NodeEditRenderer(
  {
    editingId,
    config,
    errorRenderer,
    onSaved,
    cancel,
    typeRenderers,
  }: EditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!config) return <ErrorDisplayComponent err={new Error('Configuration is required')}/>;
  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')}/>;

  nodeRendererStore.registerMap(typeRenderers)

  const service = useService();

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();
  const [ startingData, setStartingData ] = useState<Object | null>(null);
  const save = useRecoilCallback(({ snapshot }) => async () => {
    // const model = await snapshot.getPromise(modelDataStore.get(modelConfig, startingData))
    // console.log('saving model ', model)
  })

  useEffect(() => {
    (async () => {
      if (isEmpty(editingId)) {
        const newInstance = (createNewInstanceFromNodeConfig(config));
        setStartingData(newInstance)
        setLoading(false);
      } else {
        try {
          const getResult = await service.get(config.id, editingId);
          setLoading(false);
          if (!getResult.item) {
            setError(new Error(`Couldn't find a ${config.name} with ID '${editingId}'`));
            return;
          }
          setStartingData(getResult.item)
        } catch (err) {
          console.error(err);
          setLoading(false);
          setError(new Error(`There was a problem loading that ${config.name}: ${err.message}`));
          return;
        }
      }
    })()
  }, [ editingId ]);

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

  if(!startingData) return null
  const TypeRenderer = nodeRendererStore.get(config.type)

  return (
    <div className={s.editRenderer}>

    <RecoilRoot>
      {error && <ErrorDisplayComponent err={error}/>}

  {loading && <div className={s.editRenderer} data-testid='loading'>loading...</div>}

  <form onSubmit={e => {
    e.preventDefault();
    (async () => {
      await save()
    })()
  }} data-testid='form'>

  <TypeRenderer
    config={config}
    ancestryConfig={[]}
    jsonPointer=''
    originalNodeData={startingData}
    DataProvider={RecoilNodeDataProvider}
    ErrorDisplayComponent={ErrorDisplayComponent}
    />
    <button type='submit' data-testid='save'>Save</button>
    <button type='button' data-testid='cancel' onClick={() => cancel(config.id, editingId)}>Cancel</button>
  </form>
  </RecoilRoot>
  </div>
  );

}


