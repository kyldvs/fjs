/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import {flatMap} from './utils';

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
