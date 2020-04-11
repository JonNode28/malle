import React from 'react'
import * as R from 'ramda';
import s from './ListItem.pcss';
import { ListItemProps } from "malle-renderer-react";
import RendererOptions from "./RendererOptions";

export default function ListItem(props: ListItemProps & RendererOptions){

  const id: any = props.idPath ?
    R.path(props.idPath, props.item) :
    getFirstWithValue([['id'], ['Id'], ['ID'], ['key'], ['Key']], props.item);

  const title: any = props.titlePath ?
    R.path(props.titlePath, props.item) :
    getFirstWithValue([['name'], ['Name'], ['title'], ['Title'], ['id'], ['Id'], ['ID']], props.item);

  const subtext: any = props.subtextPath ?
    R.path(props.subtextPath, props.item) :
    getFirstWithValue([['description'], ['Description']], props.item);

  return (
    <div key={id} data-testid='item' className={s.item}>
      <span className={s.title} data-testid='title'>{title}</span>
      {subtext && <span className={s.subtext} data-testid='subtext'>{subtext}</span>}
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