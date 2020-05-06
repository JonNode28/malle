import React, { useEffect, useState, ReactNode, ComponentType, Fragment } from 'react'
import { getItemId } from '../util/id';
import * as R from 'ramda';
import s from './ListRenderer.pcss';
import { ListItemProps } from '../ListItemProps';
import { PaginationProps } from '../PaginationProps';
import RendererError from "../renderer-error";
import ModelConfig from "../ModelConfig";
import { useService } from "../data-provider/DataProvider";

export interface Props {
  config: ModelConfig,
  renderItem: ComponentType<ListItemProps>,
  pagination: ComponentType<PaginationProps>,
  error: ComponentType<ErrorProps>,
  validator?: (data: any) => ValidationResult
}

interface ValidationResult {
  errors: Array<PropertyValidationErrors>
}

interface PropertyValidationErrors {
  id: any,
  messages: Array<string>
}

interface ErrorProps{
  title: string,
  message: string
}

export default function ListRenderer({ config, renderItem, pagination, validator }: Props): any {

  if(!config) throw Error('Model configuration is required');

  const service = useService();

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

  const ItemRenderer = renderItem || (({item, index}) => {
    return <RendererError key={index}>Missing list item renderer control</RendererError>;
  });
  const Pagination = pagination || (({ skip, take, count, onChange }) => {
    return <RendererError>Missing Pagination control</RendererError>
  });
  return (
    <Fragment>
      {loading && <div>loading...</div>}
      {items.map((item, i) => <ItemRenderer
        key={getItemId(config.identityPath, item)}
        item={item}
        index={i}/>)}
      <Pagination skip={skip} take={take} count={count} onChange={(skip, take) => {
        setSkip(skip);
        setTake(take);
      }} />
    </Fragment>
 );
}