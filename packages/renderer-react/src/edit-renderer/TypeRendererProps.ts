import {ComponentType} from "react";
import { EditDisplayConfig } from "microo-core";

export interface TypeRendererProps {
  data: any,
  displayConfig: EditDisplayConfig,
  renderChildren?: (displayConfig: Array<EditDisplayConfig | string>) => ComponentType<any>,
  onChange?: (data: any) => void
}