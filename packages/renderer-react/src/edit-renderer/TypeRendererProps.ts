import {ComponentType} from "react";
import { EditDisplayConfig } from "microo-core";

export interface TypeRendererProps {
  displayConfig: EditDisplayConfig,
  renderChildren?: (displayConfig: Array<EditDisplayConfig | string>) => ComponentType<any>
}