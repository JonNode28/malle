import React, { useState } from "react";
import s from './StringNodeRenderer.pcss'
import { NodeRendererProps } from "microo-core";
import { createDefault } from "malle-renderer-react";
import { useNodeData } from "malle-renderer-react";

function StringNodeRenderer(
  {
    id,
    config,
    ancestryConfig,
    jsonPointer,
    originalNodeData,
  }: NodeRendererProps
){
  const isNew = typeof originalNodeData === 'undefined'
  if(isNew) originalNodeData = createDefault(config, '')
  const [ touched, setTouched ] = useState(false);
  const [ nodeData, setNodeData ] = useNodeData(id, '', originalNodeData)
  return (
    <>
      <input
        type='text'
        id={config.id}
        value={nodeData}
        data-testid='string-input'
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeData && setNodeData(e.currentTarget.value);
        }} />
      {/*{touched && validationResults && validationResults.map((result, i) => (*/}
      {/*  result.valid ? null : <div className={s.error} key={i}>{result.errorMessage}</div>*/}
      {/*))}*/}
    </>
  )
}
StringNodeRenderer.type = 'string'
export default StringNodeRenderer