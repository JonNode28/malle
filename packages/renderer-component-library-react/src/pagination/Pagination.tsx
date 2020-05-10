import s from "./Pagination.pcss";
import React from "react";
import { PaginationProps } from "./PaginationProps";

export default function Pagination({ page, size, count, renderPageItem }: PaginationProps){
  if(count === 0) return null;
  const pages = count ? ([...new Array(Math.ceil(count / size))].map((_, i) => {
    return {
      number: i + 1,
      size
    }
  })) : [];

  return (
    <div className={s.pages} data-testid='pages'>
      {pages && pages.map((eachPage) => {
        const isCurrent = eachPage.number === page && eachPage.size === size;
        return renderPageItem({ isCurrent, page: eachPage.number, size })
      })}
    </div>
  )
}