/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import {flatMap} from './utils';

/**
 * Middleware is applied to all nodes after they have been printed. In addition
 * to everything in the printer context the middleware context will also contain
 * an array of the tokens that have already been printed.
 *
 * The application order of middleware is arbitrary, do not rely on a certain
 * order.
 */
export default function getMiddleware() {
  return {
    Comments: ({node, print, tokens}) => {
      if (node.leadingComments) {
        const leadingTokens = node.leadingComments.map((comment, i, arr) => {
          const parts = [print(comment)];
          const next = i === arr.length - 1 ? node : arr[i + 1];
          const min = comment.loc.end.line;
          const max = next.loc.start.line;
          for (let j = 0; j < max - min; j++) {
            parts.push(Tokens.string('\n'));
          }
          return parts;
        });
        return [
          ...leadingTokens,
          ...tokens,
        ];
      }
      return tokens;
    },
  };
};
