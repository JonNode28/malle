import React, { useEffect, useState, ReactNode } from 'react'
import * as R from 'ramda';
import service from '../service';
import s from './ListRenderer.pcss';

type Props = {
  config: MalleModelConfig
}

export type MalleModelConfig = {
  id: string,
  name: string,
  description?: string,
  properties: Array<MallePropertyConfig>,
  identityPath?: Array<string>,
  display?: {
    list?: {
      namePath?: Array<string>,
      descriptionPath?: Array<string>,
      render?: (...args: any[]) => ReactNode
    }
  }
};

type MallePropertyConfig = {
  id: string,
  name?: string,
  description?: string,
  type: string,
  validations?: Array<MalleValidationConfig>
};

type MalleValidationConfig = {
  errorMessage: string,
  options: any
};

function ListRenderer({ config }: Props): any {

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

  return (
    <div className={s['list-renderer']}>
      <h1>{config.name}</h1>
      <p>{config.description}</p>
      {loading && <div>loading...</div>}
      {items.map((item, i) => {
        if(config.display?.list?.render){
          return config.display.list.render(item);
        } else if(config.display?.list?.descriptionPath || config.display?.list?.namePath){
            return renderItemWithPaths(config, item, i,)
          }
        return renderItemBestEffort(config, item, i);

      })}
    </div>
  );
}

function renderItemBestEffort(config: MalleModelConfig, item: any, index: number){
  const id: any = config.identityPath ?
    R.path(config.identityPath, item) :
    getFirstWithValue([['id'], ['Id'], ['ID'], ['key'], ['Key']], item);
  const name: any = getFirstWithValue([['name'], ['Name'], ['title'], ['Title'], ['id'], ['Id'], ['ID']], item);
  const description: any = getFirstWithValue([['description'], ['Description']], item);

  return renderItem(id || `${config.id}-${index}`, name || "Untitled", description);
}

function renderItemWithPaths(config:MalleModelConfig, item: any, index:number){
  const id: any = config.identityPath && getFirstWithValue([ config.identityPath ], item);
  const name: any = config.display?.list?.namePath ? getFirstWithValue([ config.display.list.namePath ], item) : null;
  const description: any = config.display?.list?.descriptionPath ? getFirstWithValue([ config.display.list.descriptionPath ], item) : null;

  return renderItem(id || `${config.id}-${index}`, name || "Untitled", description);
}

function renderItem(id: string, name: string, description?: string){
  return (
    <div key={id} data-testid='item'>
      <span className={s.name} data-testid='name'>{name}</span>
      {description && <span className={s.description} data-testid='description'>{description}</span>}
    </div>
  );
}

function getFirstWithValue(paths: Array<Array<string>>, obj: object){
  let value = null;
  paths.some(path => {
    value = R.path(path, obj);
    return value;
  });
  return value;
}


export default ListRenderer;
