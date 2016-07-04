/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

jest.autoMockOff();

import fjs from '../fjs/';

function t(s) {
  return fjs({code: s}).code;
}

it('lives!!', () => {
  expect(t(`1+1;\n`)).toBe(`1+1;`);
});
