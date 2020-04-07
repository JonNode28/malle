import React, { useState } from 'react';
import { ListRenderer } from 'malle-renderer-react';
import pageConfig from './models/page';

export default function App(){
  return (
    <div>
      Hello World
      <ListRenderer config={pageConfig}/>
    </div>
  )
}