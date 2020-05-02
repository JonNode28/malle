import {PropertyConfig} from "../PropertyConfig";
import EditDisplayConfig from "../EditDisplayConfig";
import {ComponentType} from "react";

export interface TypeRendererProps {
  data: any,
  displayConfig: EditDisplayConfig,
  renderChildren: (displayConfig: Array<EditDisplayConfig | string>) => ComponentType<any>,
  onChange?: (data: any) => void
}