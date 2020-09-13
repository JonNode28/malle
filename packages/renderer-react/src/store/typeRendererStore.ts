import { ComponentType } from "react";
import { DisplayTypeRendererProps, PropertyTypeRendererProps } from "../edit-renderer";

const displayTypeRenderers: { [typeId: string]: ComponentType<DisplayTypeRendererProps> } = {}
const propertyTypeRenderers: { [typeId: string]: ComponentType<PropertyTypeRendererProps> } = {}

export default {
  registerDisplayTypeRenderer: (typeId: string, typeRenderer: ComponentType<DisplayTypeRendererProps>) => {
    displayTypeRenderers[typeId] = typeRenderer
  },
  registerDisplayTypeRenderers: (typeId: string, typeRenderer: ComponentType<DisplayTypeRendererProps>) => {
    displayTypeRenderers[typeId] = typeRenderer
  },
  getDisplayTypeRenderer: (typeId: string): ComponentType<DisplayTypeRendererProps> => {
    const typeRenderer = displayTypeRenderers[typeId]
    if(!typeRenderer) throw new Error(`No display type renderer '${typeId}' was registered`)
    return typeRenderer
  },
  registerPropertyTypeRenderer: (typeId: string, typeRenderer: ComponentType<PropertyTypeRendererProps>) => {
    propertyTypeRenderers[typeId] = typeRenderer
  },
  getPropertyTypeRenderer: (typeId: string): ComponentType<PropertyTypeRendererProps> => {
    const typeRenderer = propertyTypeRenderers[typeId]
    if(!typeRenderer) throw new Error(`No property type renderer '${typeId}' was registered`)
    return typeRenderer
  }
}