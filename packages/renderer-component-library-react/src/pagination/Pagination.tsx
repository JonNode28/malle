import s from "./Pagination.pcss";
import React from "react";
import { PaginationProps } from "malle-renderer-react";
import cs from 'classnames'

export default function Pagination({ skip, take, count, onChange }: PaginationProps){
  const pages = count ? ([...new Array(Math.ceil(count / take))].map((_, i) => {
    return {
      label: i + 1,
      skip: take * i,
      take: take
    }
  })) : [];

  return (
    <div className={s.pages} data-testid='pages'>
      {pages && pages.map((page) => {
        const current = page.skip === skip && page.take === take;
        return current ? (
          <div key={page.label} className={cs(s.page, s.current)} data-testid='current-page'>
            {page.label}
          </div>
        ) : (
          <button
            key={page.label}
            className={s.page}
            onClick={() => onChange(page.skip, page.take)}
            data-testid='page'
          >{page.label}</button>
        );
      })}
    </div>
  )
}