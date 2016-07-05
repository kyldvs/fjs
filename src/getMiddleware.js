/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

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
        return [
          flatMap(node.leadingComments, print),
          ...tokens,
        ];
      }
      return tokens;
    },
  };
};
