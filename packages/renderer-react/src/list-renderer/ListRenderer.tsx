import React, { useEffect, useState, ReactNode, ComponentType } from 'react'
import { getItemId } from '../util/id';
import * as R from 'ramda';
import service from '../service';
import s from './ListRenderer.pcss';
import { ListItemProps } from '../ListItemProps';
import { PaginationProps } from '../PaginationProps';

export interface Props {
  config: MalleModelConfig,
  itemRenderer: ComponentType<ListItemProps>,
  pagination: ComponentType<PaginationProps>,
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

export default function ListRenderer({ config, itemRenderer, pagination, validator }: Props): any {

  if(!config) throw Error('Model configuration is required');

  const [ skip, setSkip ] = useState(0);
  const [ take, setTake ] = useState(10);
  const [ count, setCount ] = useState(0);
  const [ items, setItems ] = useState<Array<any>>([]);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const listResult = await service.list(config.id, skip, take);
      setItems(listResult.items);
      setCount(listResult.count);
      setLoading(false);
    })()
  }, [ skip, take ]);

  const ItemRenderer = itemRenderer || (({item, index}) => {
    return <div key={index} className={s.error}>Missing list item renderer control</div>;
  });
  const Pagination = pagination || (({ skip, take, count, onChange }) => {
    return <div className={s.error}>Missing Pagination control</div>
  })
  return (
    <div className={s['list-renderer']}>
      <h1>{config.name}</h1>
      <p>{config.description}</p>
      {loading && <div>loading...</div>}
      {items.map((item, i) => <ItemRenderer key={getItemId(config.identityPath, item)} item={item} index={i} />)}
      <Pagination skip={skip} take={take} count={count} onChange={(skip, take) => {
        setSkip(skip);
        setTake(take);
      }} />
    </div>
 );
}