const listFns: { [id: string]:  (skip: number, take: number) => Promise<ListResult>} = {};

type ListResult = {
  items: Array<any>,
  count: number,
  skip: number,
  take: number
}

export default {
  init: (modelId: string, fn: (skip: number, take: number) => Promise<ListResult>) => {
    listFns[modelId] = fn;
  },
  list: async (modelId: string, skip: number = 0, take: number = 10): Promise<ListResult> => {
    const fn = listFns[modelId];
    if(!fn) throw new Error(`'${modelId}' doesn't have a list function`);
    console.log(`Loading ${modelId} (skip: ${skip}, take: ${take}`);
    return fn(skip, take);
  }
}