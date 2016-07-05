/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import comments from './printers/comments';
import {flatMap} from './utils';

/**
 * Printers convert an AST into tokens which may then be formatted.
 */
export default function getPrinters() {
  return {
    ...comments,

    BinaryExpression: ({print, node}) => [
      print(node.left),
      Tokens.string(node.operator),
      print(node.right),
    ],

    File: ({print, node}) => [
      print(node.program),
       // Files end with new lines. Strip the wrapping File node if you
       // need to format a subset of the AST that should not be treated as
       // an entire file.
      Tokens.string('\n'),
    ],

    ExpressionStatement: ({print, node}) => [
      print(node.expression),
      Tokens.semiColon(),
    ],

    NumericLiteral: ({node}) => Tokens.string(node.value),

    Program: ({print, node}) => flatMap(node.body, print),
  };
};
