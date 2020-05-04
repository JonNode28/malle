import React, {Component, ComponentType, useEffect, useState} from "react";
import s from './EditRenderer.pcss';
import ModelConfig from "../ModelConfig";
import {expand, isPropertyConfig} from "../util/editDisplayConfig";
import RendererError from "../renderer-error";
import {isEmpty} from "../util/id";
import {PropertyConfig} from "../PropertyConfig";
import EditDisplayConfig from "../EditDisplayConfig";
import {getProp, queryProp} from "../util/propertyConfig";
import {createNewInstance} from "../util/model";
import {TypeRendererProps} from "./TypeRendererProps";
import {PropertyTypeRendererProps} from "./PropertyTypeRendererProps";
import ErrorBoundary from "../error-boundary";
import {useService} from "../data-provider/DataProvider";

export interface EditRendererProps {
  config: ModelConfig,
  id?: string | number,
  typeRenderers?: { [typeId: string]: ComponentType<TypeRendererProps> }
  propertyTypeRenderers?: { [typeId: string]: ComponentType<PropertyTypeRendererProps> },
  renderError?: ComponentType<{ err: Error }>
}

export default function EditRenderer({ config, id, typeRenderers, propertyTypeRenderers, renderError }: EditRendererProps){
  if(!config) throw Error('Model configuration is required');

  const service = useService();

  const [ editingModel, setEditingModel ] = useState<any>()
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string>();

  const renderErrorComponent: ComponentType<{ err: Error }> = renderError || (({ err }) => <div data-testid='error'>error: {err.message}</div>);

  useEffect(() => {
    (async () => {
      if(isEmpty(id)) {
        setEditingModel(createNewInstance(config));
        setLoading(false);
      } else {
        try {
          const getResult = await service.get(config.id, id);
          setLoading(false);
          if (!getResult.item) {
            setError(`Couldn't find a ${config.name} with ID '${id}'`);
            return;
          }
          setEditingModel(getResult.item);
        } catch(err){
          setLoading(false);
          setError(`There was a problem loading that ${config.name}: ${err.message}`);
        }
      }
    })()
  }, [ id ]);

  return (
    <div className={s.editRenderer}>

      {error && <RendererError>{error}</RendererError>}

      {loading && <div data-testid='loading'>loading...</div>}

      <form onSubmit={() => service.save(config.id, editingModel)} data-testid='form'>
        <ErrorBoundary renderError={renderErrorComponent}>
          {editingModel && renderFromDisplayConfig(config.display?.edit)}
        </ErrorBoundary>
        <button type='submit' data-testid='save'>Save</button>

      </form>

    </div>
  );

  function renderFromDisplayConfig(displayConfig?: Array<EditDisplayConfig | string>): any{
    try {
      const expandedDisplayConfig = expand(displayConfig, config.properties);

      return expandedDisplayConfig.map((itemDisplayConfig, i) => {
        return <ErrorBoundary key={i} renderError={renderErrorComponent}>
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
              return <TypeRenderer
                data={editingModel}
                propertyConfig={getProp(itemDisplayConfig.options.property, config.properties)}
                displayConfig={itemDisplayConfig}
                onChange={(data: any) => {
                  setEditingModel(data);
                }}
                renderChildren={renderFromDisplayConfig}/>
            } else {
              const TypeRenderer = typeRenderers && typeRenderers[itemDisplayConfig.type];
              if (!TypeRenderer) {
                throw new Error(`No type renderer for display type '${itemDisplayConfig.type}'. Registered type renderers: [${Object.keys(typeRenderers || {}).join(`, `)}]`);
              }
              return <TypeRenderer
                data={editingModel}
                displayConfig={itemDisplayConfig}
                renderChildren={renderFromDisplayConfig}/>
            }
          })()}
        </ErrorBoundary>
      });
    } catch(err){
      const Error = renderErrorComponent;
      return <Error err={err} />
    }
  }

}

