import React, { ComponentType, Suspense, useEffect, useState } from "react";
import s from './EditRenderer.pcss';
import { expand, isPropertyConfig } from "../util/editDisplayConfig";
import { getItemId, isEmpty } from "../util/id";
import { getProp, queryProp } from "../util/propertyConfig";
import { createNewInstance, getPropertyJsonPointer } from "../util/model";
import { DisplayTypeRendererProps } from "./DisplayTypeRendererProps";
import { PropertyTypeRendererProps } from "./PropertyTypeRendererProps";
import ErrorBoundary from "../error-boundary";
import { useService } from "../data-provider/DataProvider";
import { ErrorRendererProps } from "../error-boundary/ErrorBoundary";
import DefaultError from "../default-error";
import ptr from 'json-pointer';
import {
  RecoilRoot, useRecoilCallback,
} from 'recoil';
import {
  EditDisplayConfig,
  ModelConfig,
  PropertyConfig,
  PropertyValidator,
  ValidationExecutionStage,
  ValidationResult
} from "microo-core";
import modelDataStore from "../store/modelDataStore";
import EditModelRenderer from "./EditModelRenderer";

export interface EditRendererProps {
  modelConfig: ModelConfig
  id?: string | number
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
}

export default function EditRenderer(
  {
    modelConfig,
    id,
    errorRenderer,
    onSaved,
    cancel
  }: EditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!modelConfig) return <ErrorDisplayComponent err={new Error('Model configuration is required')}/>;
  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')}/>;

  const service = useService();

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();
  const [ startingData, setStartingData ] = useState<Object | null>(null);
  const save = useRecoilCallback(({ snapshot }) => async () => {
    const model = await snapshot.getPromise(modelDataStore.get(modelConfig, startingData))
    console.log('saving model ', model)
  })

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
  }, [ id ]);

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

  return (
    <div className={s.editRenderer}>

      {error && <ErrorDisplayComponent err={error}/>}

      {loading && <div className={s.editRenderer} data-testid='loading'>loading...</div>}

      <RecoilRoot>
        <form onSubmit={e => {
          e.preventDefault();
          (async () => {
            await save()
          })()
        }} data-testid='form'>

            <EditModelRenderer
              modelConfig={modelConfig}
              startingData={startingData}
              ErrorDisplayComponent={ErrorDisplayComponent} />

          <button type='submit' data-testid='save'>Save</button>
          <button type='button' data-testid='cancel' onClick={() => cancel(modelConfig.id, id)}>Cancel</button>

        </form>
      </RecoilRoot>

    </div>
  );

}


