/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

export default {
  NumericLiteral: ({node}) => Tokens.string(node.extra.raw),
  StringLiteral: ({node}) => Tokens.string(escapeStringLiteral(node.value)),
};

function escapeStringLiteral(value) {
  return swapQuotes(JSON.stringify(swapQuotes(value)));
}

function swapQuotes(str) {
  return str.replace(/['"]/g, m => {
    return m === '"' ? '\'' : '"';
  });
}