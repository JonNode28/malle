import React from 'react';
import s from './ExampleEdit.pcss';
import { EditRenderer } from "malle-renderer-react";
import { useParams, useHistory } from "react-router-dom";
import { ErrorPanel, StringRenderer } from 'malle-renderer-component-library-react';
import querystring from 'query-string';
import {useLocation} from "react-router";

export function ExampleEdit({ config, listUri }){
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { page, size } = querystring.parse(location.search);
  const backUri = `${listUri}${!listUri.endsWith('?') && '?' }page=${page}&size=${size}`
  return (
    <div className={s.exampleEdit}>
      <EditRenderer
        config={config}
        id={id === 'new' ? null : parseInt(id)}
        renderError={ErrorPanel}
        propertyTypeRenderers={{
          'string': StringRenderer,
          'multiline-string': ({ data, propertyConfig, onChange }) => {
            return (
              <div>
                <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
                {propertyConfig.description && <p>{propertyConfig.description}</p>}
                <textarea id={propertyConfig.id} value={data[propertyConfig.id]} onChange={(e) => {
                  onChange({
                    ...data,
                    [propertyConfig.id]: e.currentTarget.value
                  });
                }} />
              </div>
            );
          }
        }}
        cancel={() => history.push(backUri)}
        onSaved={() => history.push(backUri)}
      />
    </div>
  )
}