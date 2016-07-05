/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import {flatMap} from './utils';

export default function getPrinters() {
  return {
    BinaryExpression: ({print, node}) => [
      print(node.left),
      Tokens.string(node.operator),
      print(node.right),
    ],

    File: ({print, node}) => print(node.program),

    ExpressionStatement: ({print, node}) => [
      print(node.expression),
      Tokens.semiColon(),
    ],

    NumericLiteral: ({node}) => Tokens.string(node.value),

    Program: ({print, node}) => flatMap(node.body, print),
  };
};
