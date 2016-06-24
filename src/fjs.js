/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import {print} from './Printers';

import format from './format';
import init from './init';

// TODO: Pass in the original source, so we can do source maps.
// TODO: Create 'stack' class for storing arbitrary crap that simulates current call stack.
// TODO: Should we add options? At least for line-length.
// TODO: Fix default printer to use loc and original source instead of tokens.
// TODO: Add place to override printers.
function fjs(ast) {
  init();
  const tokens = print(ast);
  return format(tokens);
}

export default fjs;
