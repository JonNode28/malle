import React from 'react';
import s from './ErrorPanel.pcss';

interface ErrorPanelProps {
  err: Error | string
}

export default function ErrorPanel({ err }: ErrorPanelProps){
  let message: string = 'An error occurred';
  if(typeof err === 'string') message = err;
  else if(err && 'message' in err && err.message) message = err.message;
  return (
    <div className={s.error} data-testid='error-panel'>{message}</div>
  )
}