declare type ListResult = {
    items: Array<any>;
    count: number;
    skip: number;
    take: number;
};
declare const _default: {
    init: (modelId: string, fn: () => Promise<ListResult>) => void;
    list: (modelId: string) => Promise<ListResult>;
};
export default _default;
