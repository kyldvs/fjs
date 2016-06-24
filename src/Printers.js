/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import invariant from 'assert';

const printers = {};

function defaultPrinter(ast) {
  if (ast.tokens) {
    return ast.tokens
      .map(token => {
        // Make sure it's printable.
        if (token.type.label === 'eof') {
          return '\n';
        }
        if (token.value != null) {
          return String(token.value);
        }
        if (token.type.label != null) {
          return String(token.type.label);
        }
        return null;
      })
      .filter(x => !!x)
      .map(value => Tokens.string(value));
  }
  // No raw tokens to fall back on. Just put in a scary comment block.
  return [Tokens.string(`/* ERROR: Unable to print this section of code. */`)];
}

export function register(type, printer) {
  invariant(!printers[type], 'Printer already registered for type: ' + type);
  invariant(typeof printer === 'function', 'Printers must be functions.')
  printers[type] = printer;
}

export function print(ast) {
  if (!ast || !ast.type) {
    console.log('no ast???');
    return [];
  }
  if (printers[ast.type]) {
    console.log('using registered printer');
    return printers[ast.type](ast);
  }
  console.log('default printer');
  return defaultPrinter(ast);
}
