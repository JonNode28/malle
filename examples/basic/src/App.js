import React, { useState, Fragment } from 'react';
import pageConfig from './models/page';
import { ListRenderer } from "malle-renderer-react";
import { createListItemRenderer, Pagination } from "malle-renderer-component-library-react";
import Header from './components/Header';
import s from './App.pcss'
import Footer from "./components/Footer";

export default function App(){
  return (
    <Fragment>
      <Header />
      <div className={s.content}>
        <ListRenderer
          config={pageConfig}
          itemRenderer={createListItemRenderer()}
          pagination={Pagination}/>
      </div>
      <Footer />
    </Fragment>
  )
}