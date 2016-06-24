/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

jest.autoMockOff();

import {transform} from 'babel-core';
import fjs from '../fjs/';

it('lives!!', () => {
  const {ast} = transform(`1  +  1;\n`);
  expect(fjs(ast)).toBe(`1+1;\n`);
});
