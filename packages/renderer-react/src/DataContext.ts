import React, { ComponentType } from 'react'
import { NodeDataProviderProps } from "microo-core";
const DataContext = React.createContext<{ DataProvider: ComponentType<NodeDataProviderProps> | null }>({
  DataProvider: null
})

export const DataProvider = DataContext.Provider
export const DataConsumer = DataContext.Consumer

export default DataContext