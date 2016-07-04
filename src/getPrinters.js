/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import {flatMap} from './utils';

export default function getPrinters() {
  return {
    BinaryExpression: (print, n) => [
      print(n.left),
      Tokens.string(n.operator),
      print(n.right),
    ],

    File: (print, n) => print(n.program),

    ExpressionStatement: (print, n) => [
      print(n.expression),
      Tokens.semiColon(),
    ],

    NumericLiteral: (print, n) => [
      Tokens.string(n.value),
    ],

    Program: (print, n) => flatMap(n.body, print),
  };
};
