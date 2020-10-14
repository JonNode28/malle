import React, { useState } from "react";
import s from './StringNodeRenderer.pcss'
import { NodeRendererProps } from "graphter-core";
import { createDefault } from "graphter-renderer-react";
import { useNodeData } from "graphter-renderer-react";
import { useNodeValidation } from "graphter-renderer-react";

function StringNodeRenderer(
  {
    config,
    originalNodeData,
    committed = true,
    path
  }: NodeRendererProps
){
  const isNew = typeof originalNodeData === 'undefined'
  if(isNew) originalNodeData = createDefault(config, '')
  const [ touched, setTouched ] = useState(false)
  const [ nodeData, setNodeData ] = useNodeData(path, config, originalNodeData, committed)
  const validationResults = useNodeValidation(path)
  return (
    <>
      <input
        type='text'
        value={nodeData}
        data-testid='string-input'
        onChange={(e) => {
          if(!touched) setTouched(true)
          setNodeData && setNodeData(e.currentTarget.value);
        }} />
      {touched && validationResults && validationResults.map((result, i) => (
        result.valid ? null : <div className={s.error} key={i}>{result.errorMessage}</div>
      ))}
    </>
  )
}
StringNodeRenderer.type = 'string'
export default StringNodeRenderer