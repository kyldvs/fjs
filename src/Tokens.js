/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const Tokens = {
  // Tokens related to scopes.
  scopeOpen: (kind) => ({
    type: 'scopeOpen',
    scope: true,
    isBroken: false,
    unbroken: Tokens.empty(),
    broken: Tokens.indent(),
    kind,
  }),

  scopeClose: () => ({
    type: 'scopeClose',
    scope: true,
    isBroken: false,
    unbroken: Tokens.empty(),
    broken: Tokens.dedent(),
  }),

  scope: (unbroken, broken) => ({
    type: 'scope',
    scope: true,
    isBroken: false,
    unbroken,
    broken,
  }),

  scopeSpaceOrBreak: () => Tokens.scope(Tokens.space(), Tokens.break()),
  scopeEmptyOrComma: () => Tokens.scope(Tokens.empty(), Tokens.comma()),

  // Whitespace tokens.
  empty: () => ({
    type: 'empty',
  }),

  space: () => ({
    type: 'space',
  }),

  break: () => ({
    type: 'break',
  }),

  canBreak: () => ({
    type: 'canBreak',
  }),

  indent: () => ({
    type: 'indent',
  }),

  dedent: () => ({
    type: 'dedent',
  }),

  // Punctuation.
  colon: () => ({
    type: 'colon',
  }),

  comma: () => ({
    type: 'comma',
  }),

  semiColon: () => ({
    type: 'semiColon',
  }),

  // Final string token. These will be printed exactly in the result.
  string: (value) => ({
    type: 'string',
    value,
  }),
};

export default Tokens;
