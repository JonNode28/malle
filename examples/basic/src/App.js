import React, { useState } from 'react';
import pageConfig from './models/page';
import { ListRenderer } from "malle-renderer-react";
import { createListItemRenderer } from "malle-renderer-component-library-react";
import Header from './components/Header';
import s from './App.pcss'

export default function App(){
  return (
    <div className={s.app}>
      <Header />
      <ListRenderer config={pageConfig} itemRenderer={createListItemRenderer()} />
    </div>
  )
}