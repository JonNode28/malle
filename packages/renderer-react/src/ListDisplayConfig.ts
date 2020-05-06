import {ReactNode} from "react";

export default interface ListDisplayConfig{
  titlePath?: Array<string>,
  subtextPath?: Array<string>,
  render?: (...args: any[]) => ReactNode
}