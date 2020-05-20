import * as R from 'ramda'
const idPropertyCandidates = ['id', 'Id', 'ID', 'key', 'Key'];
export function getItemId(idPath:Array<string> | null | undefined, item: any): string | number {
  if(!item) throw Error(`'item' is a required argument`);
  const id = queryItemId(idPath, item);
  if(isEmpty(id)) throw Error(`Couldn't guess a sensible property as id. Tried ${idPropertyCandidates.join(', ')}.`)
  return id;
}

export function queryItemId(idPath:Array<string> | null | undefined, item: any): string | number | null {
  const id = idPath ?
    R.path<string | number | undefined>(idPath, item) :
    getFirstWithValue(idPropertyCandidates.map(candidate => [ candidate ]), item);
  return isEmpty(id) ? null : id;
}

export function isEmpty(id: any): id is undefined | null {
  return typeof id === 'undefined' ||
    id === null ||
    (typeof id === 'string' && id === '') ||
    (typeof id === 'number' && isNaN(id));
}

function getFirstWithValue(paths: Array<Array<string>>, obj: object): string | number | null{
  let value: string | number | null = null;
  paths.some(path => {
    const attemptedValue = R.path<string | number | undefined>(path, obj);
    if(attemptedValue !== undefined) value = attemptedValue;
    return null;
  });
  return value;
}