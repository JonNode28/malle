import { RecoilValueReadOnly, selector } from "recoil";
import propDataStore from "./propDataStore";
import { JsonType, NodeConfig } from "microo-core";
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

        function getNodeData(nodeConfig: NodeConfig){
          const nodeState = propDataStore.getByConfig(instanceId, nodeConfig)
          const nodeData = get(nodeState)
          if(!nodeConfig.children || !nodeData) return nodeData

          const nodeRenderer = nodeRendererStore.get(nodeConfig.type)
          if(nodeRenderer.jsonType === JsonType.ARRAY){
            return (nodeData as Array<string>).map(childId => {
              const childState = propDataStore.getByStoreId(childId)
              return get(childState)
            })
          } else if(nodeRenderer.jsonType === JsonType.OBJECT){
            return nodeConfig.children.reduce<{ [key: string]: any }>((a, c) => {
              a[c.id] = getNodeData(c)
              return a
            }, {})
          } else {
            throw new Error(`'${nodeRenderer.jsonType}' config shouldn't have children`)
          }
        }

        return getNodeData(config)

      }
    });

    return modelDataSelector
  }
}