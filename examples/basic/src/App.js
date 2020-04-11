import React, { useState } from 'react';
import pageConfig from './models/page';
import { ListRenderer } from "malle-renderer-react";
import { createListItemRenderer } from "malle-renderer-component-library-react";
import s from './App.pcss'

export default function App(){
  return (
    <div className={s.app}>
      Hello World
      <ListRenderer config={pageConfig} itemRenderer={createListItemRenderer()} />
    </div>
  )
}