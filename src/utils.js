/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

/**
 * Maps over the given array, checks for null first.
 */
export function map(arr, fn) {
  return arr && arr.map(fn);
}

/**
 * Flattens an array recursively until it contains no more arrays.
 */
export function flatten(arr) {
  if (!Array.isArray(arr)) {
    return [arr];
  }
  while (arr.some(el => Array.isArray(el))) {
    arr = Array.prototype.concat.apply([], arr);
  }
  return arr;
}

/**
 * Escapes a string literal correctly in order to converts it to using single
 * quotes.
 */
export function escapeStringLiteral(value) {
  return swapQuotes(JSON.stringify(swapQuotes(value)));
}

function swapQuotes(str) {
  return str.replace(/['"]/g, m => {
    return m === '"' ? '\'' : '"';
  });
}

/**
 * Prints a comma separated list that is wrapped in a scope.
 */
export function printList(items, print, kind) {
  if (!items) {
    return null;
  }
  return [
    Tokens.scopeOpen(kind),
    Tokens.scopeEmptyOrBreak(),
    items.map((item, i, arr) => [
      i > 0 && [
        Tokens.comma(),
        Tokens.scopeSpaceOrBreak(),
      ],
      print(item),
      i === arr.length - 1 && Tokens.scopeEmptyOrComma(),
      i === arr.length - 1 && Tokens.scopeEmptyOrBreak(),
    ]),
    Tokens.scopeClose(),
  ];
}

/**
 * Prints an array of statements respecting the spacing between them.
 */
export function printStatements(statements, print) {
  if (!statements) {
    return null;
  }
  return statements.map((node, i, arr) => {
    if (i > 0) {
      const prevEnd = arr[i - 1].loc.end.line;

      // We need to find the true start, when there are comments they are not
      // included in the starting line of the actual node.
      let currStart = node.loc.start.line;
      if (node.leadingComments && node.leadingComments.length > 0) {
        currStart = node.leadingComments[0].loc.start.line;
      }

      const extra = currStart - prevEnd - 1;
      return [
        // At max we have one extra new line, never two.
        extra > 0 && Tokens.string('\n'),
        print(node),
      ];
    }
    return print(node);
  });
}
