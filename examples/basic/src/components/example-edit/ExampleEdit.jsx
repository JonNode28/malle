import React from 'react';
import s from './ExampleEdit.pcss';
import { useParams, useHistory } from "react-router-dom";
import { ErrorPanel, StringNodeRenderer, ListNodeRenderer } from 'malle-renderer-component-library-react';
import querystring from 'query-string';
import { useLocation } from "react-router";
import { ValidationResultsProvider, ValidationSummary } from "malle-renderer-react";
import { NodeEditRenderer, ObjectTypeRenderer } from "malle-renderer-react";

export function ExampleEdit({ config, listUri }){
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { page, size } = querystring.parse(location.search);
  const backUri = `${listUri}${!listUri.endsWith('?') && '?' }page=${page}&size=${size}`
  return (
    <div className={s.exampleEdit}>
      <ValidationResultsProvider>
          <NodeEditRenderer
            config={config}
            editingId={id === 'new' ? null : parseInt(id)}
            errorRenderer={ErrorPanel}
            typeRenderers={{
                'object': ObjectTypeRenderer,
                'string': StringNodeRenderer,
                'multiline-string': ({ propData,setPropDataValue, propertyConfig, validationResults }) => {
                    return (
                        <div>
                            <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
                            {propertyConfig.description && <p>{propertyConfig.description}</p>}
                            <textarea id={propertyConfig.id} value={propData} onChange={(e) => {
                                setPropDataValue(e.currentTarget.value);
                            }} />
                        </div>
                    );
                },
                'list': ListNodeRenderer
            }}
            cancel={() => history.push(backUri)}
            onSaved={() => history.push(backUri)}
          />
          <ValidationSummary />
      </ValidationResultsProvider>
    </div>
  )
}