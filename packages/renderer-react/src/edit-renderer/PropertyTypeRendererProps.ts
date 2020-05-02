import {TypeRendererProps} from "./TypeRendererProps";
import {PropertyConfig} from "../PropertyConfig";

export interface PropertyTypeRendererProps extends TypeRendererProps {
  propertyConfig: PropertyConfig,
}