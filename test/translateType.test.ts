import { translateType } from '../src/translateType';
import { DEFAULT_CONFIG } from '../src/defaultConfig';

describe('Test translateType', () => {
  for (const typeMap of DEFAULT_CONFIG.types) {
    const expected = typeMap.label;
    it(`Translates ${expected} Type As Expected`, () => {
      for (const type of typeMap.types) {
        const result = translateType(type, DEFAULT_CONFIG.types);
        expect(result).toStrictEqual(expected);
      }
    });
  }

  it(`Translates A Missing Type As Expected`, () => {
    const result = translateType('missing', DEFAULT_CONFIG.types);
    expect(result).toStrictEqual('Missing');
  });
});
