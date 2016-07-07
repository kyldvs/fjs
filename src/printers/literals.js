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
  StringLiteral: ({node}) => Tokens.string(escapeStringLiteral(node.value)),
  // RegExpLiteral: ({node, print}) => [],
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
