import { getItemId } from "./id";

describe('getItemId()', () => {
  it('should use the idPath is provided', () => {
    const id = getItemId([ 'specialId' ], { specialId: 'some-id'});
    expect(id).toBe('some-id');
  });
  it.each(['id', 'Id', 'ID', 'key', 'Key'])('should default to a sensible property when no idPath is provided', (prop) => {
    const id = getItemId(null, { [prop]: 'some-id'});
    expect(id).toBe('some-id');
  });
  it(`should error when no idPath provided and it can't guess a sensible property`, () => {
    expect(() => {
      getItemId(null, { specialId: 'some-id'});
    }).toThrow();
  });
});

export {};