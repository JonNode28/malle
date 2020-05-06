import * as R from 'ramda'
const idPropertyCandidates = ['id', 'Id', 'ID', 'key', 'Key'];
export function getItemId(idPath:Array<string> | null | undefined, item: any): string{
  if(!item) throw Error(`'item' is a required argument`);
  const id = idPath ?
    R.path(idPath, item) :
    getFirstWithValue(idPropertyCandidates.map(candidate => [ candidate ]), item);
  if(isEmpty(id)) throw Error(`Couldn't guess a sensible property as id. Tried ${idPropertyCandidates.join(', ')}.`)
  return id as string;
}
export function isEmpty(id: any): id is undefined | null {
  return typeof id === 'undefined' ||
    id === null ||
    (typeof id === 'string' && id === '') ||
    (typeof id === 'number' && isNaN(id));
}

function getFirstWithValue(paths: Array<Array<string>>, obj: object): string | null{
  let value: number | string | null = null;
  paths.some(path => {
    const attemptedValue = R.path(path, obj) as string;
    if(attemptedValue !== undefined) value = attemptedValue;
    return attemptedValue;
  });
  return value;
}