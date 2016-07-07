/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

export default {
  BooleanLiteral: ({node}) => (
    node.value ? Tokens.string('true') : Tokens.string('false')
  ),

  DirectiveLiteral: ({node}) => Tokens.string(escapeStringLiteral(node.value)),

  NullLiteral: () => Tokens.string('null'),

  NumericLiteral: ({node}) => Tokens.string(node.extra.raw),

  RegExpLiteral: ({node}) => [
    Tokens.string('/'),
    Tokens.string(node.pattern),
    Tokens.string('/'),
    node.flags && Tokens.string(node.flags),
  ],

  StringLiteral: ({node}) => Tokens.string(escapeStringLiteral(node.value)),

  // TemplateLiteral: ({node, print}) => [],
};

function escapeStringLiteral(value) {
  return swapQuotes(JSON.stringify(swapQuotes(value)));
}

function swapQuotes(str) {
  return str.replace(/['"]/g, m => {
    return m === '"' ? '\'' : '"';
  });
}
