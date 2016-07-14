/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import {map, printList} from './utils';

/**
 * These are not first-class printers. They are helpers for common patterns.
 * For example there are many different ways to represent something that looks
 * like an assignment, and they are all printed the same.
 */
export default {
  Array: ({print, elements}) => [
    Tokens.string('['),
    printList(elements, print),
    Tokens.string(']'),
  ],

  Assignment: ({print, left, right}) => [
    print(left),
    Tokens.space(),
    Tokens.string('='),
    right && [
      right.type === 'JSXElement' && [
        Tokens.scopeOpen('jsx_after_assignment'),
        Tokens.scopeSpaceOrBreak(),
        print(right),
        Tokens.scopeClose(),
      ],
      right.type !== 'JSXElement' && [
        Tokens.space(),
        print(right),
      ],
    ],
  ],

  Object: ({print, properties}) => [
    Tokens.string('{'),
    properties.length && [
      Tokens.scopeOpen('object'),
      map(properties, (property, i, arr) => [
        Tokens.scopeSpaceOrBreak(),
        print(property),
        arr.length - 1 !== i ? Tokens.comma() : Tokens.scopeEmptyOrComma(),
      ]),
      Tokens.scopeSpaceOrBreak(),
      Tokens.scopeClose(),
    ],
    Tokens.string('}'),
  ],

  String: ({value, quotes}) => [
    quotes === 'double' && Tokens.string(JSON.stringify(value)),
    quotes === 'single' && Tokens.string(escapeStringLiteral(value)),
  ],
};

function escapeStringLiteral(value) {
  return swapQuotes(JSON.stringify(swapQuotes(value)));
}

function swapQuotes(str) {
  return str.replace(/['"]/g, m => {
    return m === '"' ? '\'' : '"';
  });
}
