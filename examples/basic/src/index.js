import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { service } from 'malle-renderer-react';

const numberOfPages = 1097
const pages = [...new Array(numberOfPages)].map((_, i) => {
  return {
    id: i,
    somethingElse: `blah blah ${i}`,
    name: `Some name ${i}`,
    description: `Some descriptive text ${i}`
  }
})

service.init('page', (skip, take) => {
  return {
    count: pages.length,
    skip: 0,
    take: 10,
    items: pages.slice(skip || 0, (skip || 0) + (take || 10))
  };
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
