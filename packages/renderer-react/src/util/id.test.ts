import {getItemId, isEmpty} from "./id";

const emptyIdValues = [ undefined, null, '', NaN ];

describe('getItemId()', () => {
  it('should use the idPath is provided', () => {
    const id = getItemId([ 'specialId' ], { specialId: 'some-id'});
    expect(id).toBe('some-id');
  });
  it.each(['id', 'Id', 'ID', 'key', 'Key'])
  (`should default to a sensible property '%p' when no idPath is provided`, (prop) => {
    const id = getItemId(null, { [prop]: 'some-id'});
    expect(id).toBe('some-id');
  });
  it(`should error when no idPath provided and it can't guess a sensible property`, () => {
    expect(() => {
      getItemId(null, { specialId: 'some-id'});
    }).toThrow();
  });
  it.each(emptyIdValues)
  (`should error when idPath is defined but it finds empty id value '%p'`, (emptyIdValue) => {
    expect(() => {
      getItemId([ 'id' ], { id: emptyIdValue});
    }).toThrow();
  });
  it.each([false, 0, -0,])
  (`should not error with falsy id value '%p'`, (falsyIdValue) => {
    getItemId(null, { id: falsyIdValue});
  });
});

describe('isEmpty()', () => {
  it.each(emptyIdValues)
  (`should return true with empty id value '%p'`, (emptyIdValue) => {
    const result = isEmpty(emptyIdValue);
    expect(result).toBe(true);
  });
  it.each([1, 'some-id'])
  (`should return false with id value '%p'`, (idValue) => {
    const result = isEmpty(idValue);
    expect(result).toBe(false);
  });
});

export {};