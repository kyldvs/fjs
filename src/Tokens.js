/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const Tokens = {
  // Tokens related to scopes.
  scopeOpen: (kind) => ({
    type: 'scopeStart',
    kind,
  }),

  scopeClose: (kind) => ({
    type: 'scopeClose',
    kind,
  }),

  scopeSpace: () => ({
    type: 'scopeSpace',
  }),

  scopeBreak: () => ({
    type: 'scopeBreak',
  }),

  // Whitespace tokens.
  space: () => ({
    type: 'space',
  }),

  break: () => ({
    type: 'break',
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
