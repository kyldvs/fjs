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

    // Remove extra breaks. Simplified for now, we need to traverse other
    // non printable characters to remove extra breaks in the future.
    tokens => tokens.filter((token, i) => (
      token.type !== 'break' ||
      (
        i > 0 &&
        tokens[i - 1].type !== 'break'
      )
    )),

    // Map the final tokens back to strings.
    tokens => tokens.map(token => {
      switch (token.type) {
        case 'break':
          return Tokens.string('\n');

        case 'colon':
          return Tokens.string(':');

        case 'comma':
          return Tokens.string(',');

        case 'semiColon':
          return Tokens.string(';');

        case 'space':
          return Tokens.string(' ');

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
