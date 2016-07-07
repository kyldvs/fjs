/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

jest.autoMockOff();

import Tokens from '../Tokens';

const IGNORE = new Set([
  'scopeEmptyOrBreak',
  'scopeEmptyOrComma',
  'scopeSpaceOrBreak',
]);

describe('tokens-spelling', () => {
  Object.keys(Tokens).forEach(key => {
    if (!IGNORE.has(key)) {
      it('Tokens.' + key + '() should have correct type', () => {
        expect(Tokens[key]().type).toBe(key);
      });
    }
  });
});
