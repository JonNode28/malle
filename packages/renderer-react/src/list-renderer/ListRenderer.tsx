import React, { useEffect, useState, ReactNode, ComponentType } from 'react'
import { getItemId } from '../util/id';
import * as R from 'ramda';
import service from '../service';
import s from './ListRenderer.pcss';
import { ListItemProps } from "./ListItemProps";

export interface Props {
  config: MalleModelConfig,
  itemRenderer?: ComponentType<ListItemProps>,
  validator?: (data: any) => ValidationResult
}

interface ValidationResult {
  errors: Array<PropertyValidationErrors>
}

interface PropertyValidationErrors {
  id: any,
  messages: Array<string>
}

export interface MalleModelConfig {
  id: string,
  name: string,
  description?: string,
  properties: Array<MallePropertyConfig>,
  identityPath?: Array<string>,
  display?: {
    list?: {
      titlePath?: Array<string>,
      subtextPath?: Array<string>,
      render?: (...args: any[]) => ReactNode
    }
  }
}

interface MallePropertyConfig {
  id: string,
  name?: string,
  description?: string,
  type: string,
  validations?: Array<MalleValidationConfig>
}

interface MalleValidationConfig {
  errorMessage: string,
  options: any
}

export default function ListRenderer({ config, itemRenderer, validator }: Props): any {

  if(!config) throw Error('Model configuration is required');

  const [ skip, setSkip ] = useState(0);
  const [ take, setTake ] = useState(10);
  const [ items, setItems ] = useState<Array<any>>([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const listResult = await service.list(config.id);
      setItems(listResult.items);
      setLoading(false);
    })()
  }, [ ]);
  const ItemRenderer = itemRenderer || (({item, index}) => <div key={index}>Missing {config.id} Item Renderer. Item Data: {JSON.stringify(item)}</div>);
  return (
    <div className={s['list-renderer']}>
      <h1>{config.name}</h1>
      <p>{config.description}</p>
      {loading && <div>loading...</div>}
      {items.map((item, i) => <ItemRenderer key={getItemId(config.identityPath, item)} item={item} index={i} />)}
    </div>
 );
}