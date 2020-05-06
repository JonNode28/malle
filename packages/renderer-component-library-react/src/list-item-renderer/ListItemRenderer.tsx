import React, { Fragment } from 'react'
import * as R from 'ramda';
import s from './ListItemRenderer.pcss';
import { ListItemProps } from "malle-renderer-react";
import RendererOptions from "./RendererOptions";

export default function ListItemRenderer({ idPath, item, titlePath, subtextPath }: ListItemProps & RendererOptions){

  const id: any = idPath ?
    R.path(idPath, item) :
    getFirstWithValue([['id'], ['Id'], ['ID'], ['key'], ['Key']], item);

  const title: any = titlePath ?
    R.path(titlePath, item) :
    getFirstWithValue([['name'], ['Name'], ['title'], ['Title'], ['id'], ['Id'], ['ID']], item);

  const subtext: any = subtextPath ?
    R.path(subtextPath, item) :
    getFirstWithValue([['description'], ['Description']], item);

  return (
    <Fragment>
      <span className={s.title} data-testid='item-title'>{title}</span>
      {subtext && <span className={s.subtext} data-testid='item-subtext'>{subtext}</span>}
    </Fragment>
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