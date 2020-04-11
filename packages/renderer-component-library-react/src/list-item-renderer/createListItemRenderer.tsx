import React from 'react'
import RendererOptions from "./RendererOptions";
import { ListItemProps } from "malle-renderer-react";
import ListItem from "./ListItem";

export default function createListItemRenderer(options?: RendererOptions){
  return (props: ListItemProps) => {
    return <ListItem {...props} {...options} />
  }
}