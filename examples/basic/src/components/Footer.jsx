import React from 'react';
import s from './Footer.pcss';

export default function Footer({}){
  return (
    <footer className={s.footer}>
      <ul>
        <li><a href='https://github.com/JonNode28/malle' target='_blank'>Github</a></li>
        <li>Copyright Scopic CMS 2020</li>
      </ul>
    </footer>
  )
}