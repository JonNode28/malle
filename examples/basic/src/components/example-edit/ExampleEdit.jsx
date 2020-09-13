import React, {Fragment} from 'react';
import s from './ExampleEdit.pcss';
import { EditRenderer } from "malle-renderer-react";
import { useParams, useHistory } from "react-router-dom";
import { ErrorPanel, StringRenderer, ListRenderer } from 'malle-renderer-component-library-react';
import querystring from 'query-string';
import { useLocation } from "react-router";
import { ValidationResultsProvider, ValidationSummary } from "malle-renderer-react";

export function ExampleEdit({ config, listUri }){
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const { page, size } = querystring.parse(location.search);
  const backUri = `${listUri}${!listUri.endsWith('?') && '?' }page=${page}&size=${size}`
  return (
    <div className={s.exampleEdit}>
      <ValidationResultsProvider>
          <EditRenderer
            modelConfig={config}
            id={id === 'new' ? null : parseInt(id)}
            errorRenderer={ErrorPanel}
            propertyTypeRenderers={{
                'string': StringRenderer,
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
                'list': ListRenderer
            }}
            cancel={() => history.push(backUri)}
            onSaved={() => history.push(backUri)}
          />
          <ValidationSummary />
      </ValidationResultsProvider>
    </div>
  )
}