/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

export default {
  DirectiveLiteral: ({node}) => Tokens.string(escapeStringLiteral(node.value)),
  StringLiteral: ({node}) => Tokens.string(escapeStringLiteral(node.value)),
  NumericLiteral: ({node}) => Tokens.string(node.extra.raw),
  // NullLiteral: ({node, print}) => [],
  // BooleanLiteral: ({node, print}) => [],
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
