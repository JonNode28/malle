import { ComponentType } from "react";
import {PaginationPageProps} from "./PaginationPageProps";

export interface PaginationProps {
  page: number
  size: number
  count: number,
  renderPageItem: (props: PaginationPageProps) => ComponentType<PaginationPageProps>
}