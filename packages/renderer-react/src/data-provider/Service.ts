import {ListResult} from "./ListResult";
import {GetResult} from "./GetResult";
import {SaveResult} from "./SaveResult";

export interface Service {
  list: (modelId: string, skip: number, take: number) => Promise<ListResult>,
  get: (modelId: string, instanceId: string | number) => Promise<GetResult>,
  save: (modelId: string, instance: any) => Promise<SaveResult>
}