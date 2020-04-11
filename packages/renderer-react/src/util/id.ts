import * as R from 'ramda'
const idPropertyCandidates = ['id', 'Id', 'ID', 'key', 'Key'];
export function getItemId(idPath:Array<string> | null | undefined, item: any): string{
  if(!item) throw Error(`'item' is a required argument`);
  const id = idPath ?
    R.path(idPath, item) :
    getFirstWithValue(idPropertyCandidates.map(candidate => [ candidate ]), item);
  if(!id) throw Error(`Couldn't guess a sensible property as id. Tried ${idPropertyCandidates.join(', ')}.`)
  return id as string;
}

function getFirstWithValue(paths: Array<Array<string>>, obj: object): string{
  let value: number | string = '';
  paths.some(path => {
    value = R.path(path, obj) as string;
    return value;
  });
  return value;
}