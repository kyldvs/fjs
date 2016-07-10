/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';
import Tokens from '../Tokens';

export default {
  BooleanLiteral: ({node}) => (
    node.value ? Tokens.string('true') : Tokens.string('false')
  ),

  DirectiveLiteral: ({node}) => Printers.String({
    value: node.value,
    quotes: 'single',
  }),

  NullLiteral: () => Tokens.string('null'),

  NumericLiteral: ({node}) => Tokens.string(node.extra.raw),

  RegExpLiteral: ({node}) => [
    Tokens.string('/'),
    Tokens.string(node.pattern),
    Tokens.string('/'),
    node.flags && Tokens.string(node.flags),
  ],

  StringLiteral: ({node}) => Printers.String({
    value: node.value,
    quotes: 'single',
  }),

  // TemplateLiteral: ({node, print}) => [],
};
