const listFns: { [id: string]:  () => Promise<ListResult>} = {};

type ListResult = {
  items: Array<any>,
  count: number,
  skip: number,
  take: number
}

export default {
  init: (modelId: string, fn: () => Promise<ListResult>) => {
    listFns[modelId] = fn;
  },
  list: async (modelId: string): Promise<ListResult> => {
    const fn = listFns[modelId];
    if(!fn) throw new Error(`'${modelId}' doesn't have a list function`);
    return fn();
  }
}
