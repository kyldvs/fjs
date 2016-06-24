/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import invariant from 'assert';

function format(tokens) {
  return tokens
    .map(token => {
      switch (token.type) {
        case 'line':
        case 'string':
          return token.value;

        default:
          invariant(false, 'Unhandled token type: ' + token.type);
      }
    })
    .filter(x => !!x)
    .join('');
}

export default format;
