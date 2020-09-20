import React, { useState } from "react";
import s from './StringNodeRenderer.pcss'
import { NodeRendererProps } from "microo-core";
import { createDefault } from "malle-renderer-react";

function StringNodeRenderer(
  {
    config,
    ancestryConfig,
    jsonPointer,
    nodeData,
    setNodeDataValue,
    validationResults,
    DataProvider,
  }: NodeRendererProps
){
  const isNew = typeof nodeData === 'undefined'
  if(isNew) nodeData = createDefault(config, '')
  const [ touched, setTouched ] = useState(false);
  return (
    <>
      <input
        type='text'
        id={config.id}
        value={nodeData}
        data-testid='string-input'
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeDataValue && setNodeDataValue(e.currentTarget.value);
        }} />
      {touched && validationResults && validationResults.map((result, i) => (
        <div className={s.error} key={i}>{result.errorMessage}</div>
      ))}
    </>
  )
}
StringNodeRenderer.type = 'string'
export default StringNodeRenderer