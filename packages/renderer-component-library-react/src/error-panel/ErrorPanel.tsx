import React from 'react';
import s from './ErrorPanel.pcss';

export default function ErrorPanel({ err }: any){
  return (
    <div className={s.error} data-testid='error-panel'>{err?.message || 'An error occurred'}</div>
  )
}