import { RecoilValueReadOnly, selector } from "recoil";
import propDataStore from "./propDataStore";
import { JsonType, NodeConfig, PathSegment } from "microo-core";
import * as nodeRendererStore from "./nodeRendererStore";

const modelDataMap: { [key: string]: RecoilValueReadOnly<any> } = {};

export default {
  get: (instanceId: string | number, config: NodeConfig) => {

    const key = `${config.id}-${instanceId}-c2c87429-dabf-4ea0-b2e1-6e7a6262bc11`

    let modelDataSelector = modelDataMap[key]

    if(modelDataSelector) return modelDataSelector

    modelDataMap[key] = modelDataSelector = selector<any>({
      key: 'ModelDataSelector',
      get: ({ get }) => {
        function getNodeData(path: Array<PathSegment>){
          const nodeConfig = propDataStore.getConfig(path)
          const nodeRenderer = nodeRendererStore.get(nodeConfig.type)
          if(!nodeRenderer) throw new Error(`No renderer for '${nodeConfig.id}' node of type '${nodeConfig.type}'`)
          if(nodeRenderer.jsonType === JsonType.ARRAY){
            if(!nodeConfig.children) throw new Error(`'${nodeConfig.id}' seems to be an array type but has no child config. At least one is required.`)
            const nodeChildStates = propDataStore.getAll(path)
            return (nodeChildStates).map(childState => {
              if(!childState) throw new Error('Missing state. Should not happen')
              return get(childState)
            })
          } else if(nodeRenderer.jsonType === JsonType.OBJECT){
            if(!nodeConfig.children) throw new Error(`'${nodeConfig.id}' seems to be an object type but has no child config. At least one is required.`)
            return nodeConfig.children?.reduce<{ [key: string]: any }>((a, c) => {
              a[c.id] = getNodeData([ ...path, c.id ])
              return a
            }, {})
          } else {
            const nodeState = propDataStore.get(path)
            return get(nodeState)
          }
        }
        return getNodeData([ config.id, instanceId ])
      }
    });

    return modelDataSelector
  }
}