import React, { useState, Fragment } from 'react';
import pageConfig from './models/page';
import nodePageConfig from './models/node-page'
import { ListRenderer } from "malle-renderer-react";
import { Pagination } from "malle-renderer-component-library-react";
import Header from './components/Header';
import s from './App.pcss'
import Footer from "./components/Footer";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import ExampleListItem from "./components/example-list-item/ExampleListItem";
import { ExampleEdit } from "./components/example-edit/ExampleEdit";
import { DataProvider } from "malle-renderer-react";
import service from './service';
import ExampleList from "./components/example-list";
import { ValidationResultsProvider } from "malle-renderer-react";
import { ExampleNodeEdit } from "./components/example-node-edit/ExampleNodeEdit";

export default function App(){
  return (
    <Fragment>
        <DataProvider service={service}>
          <Router>
            <Header />
            <div className={s.content}>
              <Switch>
                <Route path='/pages'>
                  <ExampleList />
                </Route>
                <Route path='/page/:id'>
                  <ExampleEdit config={pageConfig} listUri='/pages' />
                </Route>
                <Route path='/node-page/:id'>
                  <ExampleNodeEdit config={nodePageConfig} listUri='/pages' />
                </Route>
              </Switch>
            </div>
            <Footer />
          </Router>
        </DataProvider>
    </Fragment>
  )
}