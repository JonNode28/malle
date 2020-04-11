import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { service } from 'malle-renderer-react';
service.init('page', () => {
  return {
    count: 1,
    skip: 0,
    take: 10,
    items: [
      {
        id: 1,
        somethingElse: 'blah blah 1',
        name: 'Some name 1',
        description: 'Some descriptive text 1'
      },
      {
        id: 2,
        somethingElse: 'blah blah 2',
        name: 'Some name 2',
        description: 'Some descriptive text 2'
      },
      {
        id: 3,
        somethingElse: 'blah blah 3',
        name: 'Some name 3',
        description: 'Some descriptive text 3'
      }
    ]
  };
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
