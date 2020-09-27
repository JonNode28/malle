import React from 'react';
import s from './ExampleEdit.pcss';
import { useParams, useHistory } from "react-router-dom";
import querystring from 'query-string';
import { useLocation } from "react-router";
import {
  ValidationResultsProvider,
  ValidationSummary,
  NodeEditRenderer
} from "malle-renderer-react";
import {
  ErrorPanel,
  registerStringNodeRenderer,
  registerObjectNodeRenderer,
  registerListNodeRenderer
} from "malle-renderer-component-library-react";
import { NodeDataProvider, recoilNodeDataHook } from "malle-renderer-react";

export function ExampleEdit({config, listUri}) {
  const {id} = useParams();
  const history = useHistory();
  const location = useLocation();
  const {page, size} = querystring.parse(location.search);
  const backUri = `${listUri}${!listUri.endsWith('?') && '?'}page=${page}&size=${size}`
  return (
    <div className={s.exampleEdit}>
      <NodeDataProvider nodeDataHook={recoilNodeDataHook}>
        <NodeEditRenderer
          config={config}
          editingId={id === 'new' ? null : parseInt(id)}
          errorRenderer={ErrorPanel}
          typeRegistry={[
            registerStringNodeRenderer(),
            registerObjectNodeRenderer(),
            registerListNodeRenderer(),
            {
              type: 'multiline-string',
              renderer: ({propData, setPropDataValue, propertyConfig, validationResults}) => {
                return (
                  <div>
                    <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
                    {propertyConfig.description && <p>{propertyConfig.description}</p>}
                    <textarea id={propertyConfig.id} value={propData} onChange={(e) => {
                      setPropDataValue(e.currentTarget.value);
                    }}/>
                  </div>
                );
              }
            }
          ]}
          cancel={() => history.push(backUri)}
          onSaved={() => history.push(backUri)}
        />
      </NodeDataProvider>
    </div>
  )
}

// typeRenderers={
// {
//     'object': ObjectNodeRenderer_old,
//     'multiline-string': ({ propData,setPropDataValue, propertyConfig, validationResults }) => {
//     return (
//         <div>
//             <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
//             {propertyConfig.description && <p>{propertyConfig.description}</p>}
//             <textarea id={propertyConfig.id} value={propData} onChange={(e) => {
//                 setPropDataValue(e.currentTarget.value);
//             }} />
//         </div>
//     );
// },
//     'list': ListNodeRenderer
// }}