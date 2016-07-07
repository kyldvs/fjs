/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const Tokens = {
  // Tokens related to scopes.
  scopeOpen: (kind) => ({
    type: 'scopeOpen',
    scope: true,
    unbroken: Tokens.empty(),
    broken: Tokens.indent(),
    kind,
  }),

  scopeOpenNoIndent: (kind) => ({
    type: 'scopeOpen',
    scope: true,
    unbroken: Tokens.empty(),
    broken: Tokens.empty(),
    kind,
  }),

  scopeClose: () => ({
    type: 'scopeClose',
    scope: true,
    unbroken: Tokens.empty(),
    broken: Tokens.dedent(),
  }),

  scopeCloseNoDedent: () => ({
    type: 'scopeClose',
    scope: true,
    unbroken: Tokens.empty(),
    broken: Tokens.empty(),
  }),

  scope: (unbroken, broken) => ({
    type: 'scope',
    scope: true,
    unbroken,
    broken,
  }),

  scopeEmptyOrBreak: () => Tokens.scope(Tokens.empty(), Tokens.break()),
  scopeEmptyOrComma: () => Tokens.scope(Tokens.empty(), Tokens.comma()),
  scopeSpaceOrBreak: () => Tokens.scope(Tokens.space(), Tokens.break()),
  scopeEmptyOrOpenParen: () => Tokens.scope(Tokens.empty(), Tokens.string('(')),
  scopeEmptyOrCloseParen: () => Tokens.scope(
    Tokens.empty(),
    Tokens.string(')'),
  ),
  scopeEmptyOrIndent: () => Tokens.scope(Tokens.empty(), Tokens.indent()),
  scopeEmptyOrDedent: () => Tokens.scope(Tokens.empty(), Tokens.dedent()),

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

  period: () => ({
    type: 'period',
  }),

  questionMark: () => ({
    type: 'questionMark',
  }),

  // Final string token. These will be printed exactly in the result.
  string: (value) => ({
    type: 'string',
    value,
  }),
};

export default Tokens;
