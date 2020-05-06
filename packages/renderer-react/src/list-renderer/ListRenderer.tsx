import React, { useEffect, useState, ReactNode, ComponentType, Fragment } from 'react'
import { getItemId } from '../util/id';
import { ListItemProps } from '../ListItemProps';
import { PaginationProps } from '../PaginationProps';
import ModelConfig from "../ModelConfig";
import { useService } from "../data-provider/DataProvider";
import ErrorBoundary from "../error-boundary";

export interface ListRendererProps {
  config: ModelConfig,
  renderItem: ComponentType<ListItemProps>,
  pagination: ComponentType<PaginationProps>,
  validator?: (data: any) => ValidationResult,
  errorRenderer?: ComponentType<{ err: Error }>
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

export default function ListRenderer({ config, renderItem, pagination, validator, errorRenderer }: ListRendererProps): any {
  const ErrorDisplayComponent: ComponentType<{ err: Error }> = errorRenderer || (({ err }) => <div data-testid='error'>error: {err.message}</div>);
  if(!config) return <ErrorDisplayComponent err={new Error('Model configuration is required')} />;

  const service = useService();

  const [ skip, setSkip ] = useState(0);
  const [ take, setTake ] = useState(10);
  const [ count, setCount ] = useState(0);
  const [ items, setItems ] = useState<Array<any>>([]);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<Error>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      let listResult;
      try {
        listResult = await service.list(config.id, skip, take);
      } catch(err){
        setLoading(false);
        setError(err);
        return;
      }
      setItems(listResult.items);
      setCount(listResult.count);
      setLoading(false);
    })()
  }, [ config, skip, take ]);

  const ItemRenderer = renderItem || (({item, index}) => {
    return <ErrorDisplayComponent key={index} err={new Error('Missing list item renderer control')} />;
  });
  const Pagination = pagination || (({ skip, take, count, onChange }) => {
    return <ErrorDisplayComponent err={new Error('Missing Pagination control')} />;
  });
  return (
    <Fragment>
      { error && <ErrorDisplayComponent err={error} /> }
      { loading && <div>loading...</div> }
      {items.map((item, i) => (
        <ErrorBoundary
          key={getItemId(config.identityPath, item)}
          errorRenderer={ErrorDisplayComponent}>
          <ItemRenderer
            item={item}
            index={i}/>
        </ErrorBoundary>
          ))}
      <ErrorBoundary errorRenderer={ErrorDisplayComponent}>
        <Pagination skip={skip} take={take} count={count} onChange={(skip, take) => {
          setSkip(skip);
          setTake(take);
        }} />
      </ErrorBoundary>
    </Fragment>
 );
}