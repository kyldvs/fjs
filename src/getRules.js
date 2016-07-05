/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import assert from 'assert';

/**
 * Rules convert an array of tokens into another array of tokens. Rules
 * are run in the particular order they are defined. Once all rules are
 * run all tokens must be string tokens.
 */
export default function getRules() {
  return [
    tokens => tokens.filter(token => !!token),

    // TODO: Add formatting rules here.

    tokens => tokens.map(token => {
      switch (token.type) {
        case 'semiColon':
          return Tokens.string(';');

        case 'string':
          return token;

        default:
          assert(false, 'Unhandled token type: ' + token.type);
          return null;
      }
    }),

    tokens => tokens.filter(token => !!token),
  ];
};
