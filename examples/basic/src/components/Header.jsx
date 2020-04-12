import React from 'react';
import s from './Header.pcss';

export default function Header({}) {
  return (
    <header className={s.header}>
      <div className={s.logo}>
        <h1 className={s.text}>Scopic CMS</h1>
        <p className={s.subtext}>less than anyone else</p>
      </div>
    </header>
  );
}