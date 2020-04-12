import React from 'react';
import s from './Header.pcss';

export default function Header({}) {
  return (
    <header className={s.header}>
      <h1 className={s.logo}>Malle CMS</h1>
      <p className={s.subtext}>- doing less than any one else</p>
    </header>
  );
}