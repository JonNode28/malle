import React, { ComponentType, useEffect, useState } from "react";
import s from './NodeEditRenderer.pcss';
import { isEmpty } from "../util/id";
import { useService } from "../data-provider/DataProvider";
import DefaultError from "../default-error";
import {
  RecoilRoot, useRecoilCallback,
} from 'recoil';
import {
  NodeConfig,
  ErrorRendererProps, NodeRendererProps, NodeRendererRegistration,
} from "microo-core";
import nodeRendererStore from "../store/nodeRendererStore";
import RecoilNodeDataProvider from "./RecoilNodeDataProvider";
import { v4 } from "uuid";

export interface NodeEditRendererProps {
  config: NodeConfig
  editingId?: string | number
  errorRenderer?: ComponentType<ErrorRendererProps>
  onSaved?: (modelId: string, instance: any) => void
  cancel: (modelId: string | undefined, instance: any) => void
  typeRegistry: Array<NodeRendererRegistration>
  children: any
}

export default function NodeEditRenderer(
  {
    editingId,
    config,
    errorRenderer,
    onSaved,
    cancel,
    typeRegistry,
    children
  }: NodeEditRendererProps) {

  const ErrorDisplayComponent: ComponentType<ErrorRendererProps> = errorRenderer || DefaultError;

  if (!config) return <ErrorDisplayComponent err={new Error('Configuration is required')}/>;
  if (!cancel) return <ErrorDisplayComponent err={new Error('A cancel function is required')}/>;

  nodeRendererStore.registerAll(typeRegistry)

  const service = useService();

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();
  const [ startingData, setStartingData ] = useState<any>(undefined);
  const save = useRecoilCallback(({ snapshot }) => async () => {
    // const model = await snapshot.getPromise(modelDataStore.get(modelConfig, startingData))
    // console.log('saving model ', model)
  })

  useEffect(() => {
    (async () => {
      if (isEmpty(editingId)) {
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

  if(!startingData) return null
  const registration = nodeRendererStore.get(config.type)
  const TypeRenderer = registration.renderer

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

        <RecoilNodeDataProvider
          config={config}
          id={v4()}
          originalNodeData={startingData}
          jsonPointer='' >
          {(dataProps) => {
            return (
              <TypeRenderer
              config={config}
              ancestryConfig={[]}
              jsonPointer=''
              {...dataProps}
              options={registration.options}
              DataProvider={RecoilNodeDataProvider}
              ErrorDisplayComponent={ErrorDisplayComponent}
            />
            )
          }}
        </RecoilNodeDataProvider>
        <button type='submit' data-testid='save'>Save</button>
        <button type='button' data-testid='cancel' onClick={() => cancel(config.id, editingId)}>Cancel</button>
      </form>
    </RecoilRoot>
  </div>
  );

}


