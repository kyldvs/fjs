/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import comments from './printers/comments';
import literals from './printers/literals';
import {map} from './utils';

/**
 * Printers convert an AST into tokens which may then be formatted.
 */
export default function getPrinters() {
  return {
    ...comments,
    ...literals,

    BinaryExpression: ({print, node}) => [
      print(node.left),
      Tokens.space(),
      Tokens.string(node.operator),
      Tokens.space(),
      print(node.right),
    ],

    File: ({print, node}) => [
      print(node.program),
      // Files end with new lines. Strip the wrapping File node if you
      // need to format a subset of the AST that should not be treated as
      // an entire file.
      Tokens.break(),
    ],

    ExpressionStatement: ({print, node}) => [
      print(node.expression),
      Tokens.semiColon(),
      Tokens.break(),
    ],

    Program: ({print, node}) => map(node.body, print),

    // Uncategorized / WIP

    AssignmentExpression: ({print, node}) => [
      print(node.left),
      Tokens.space(),
      Tokens.string('='),
      Tokens.space(),
      print(node.right),
    ],

    VariableDeclaration: ({print, node}) => [
      Tokens.string(node.kind),
      Tokens.space(),
      map(node.declarations, (declaration, i) => [
        i > 0 && [Tokens.comma(), Tokens.space()],
        print(declaration),
      ]),
      Tokens.semiColon(),
      Tokens.break(),
    ],

    VariableDeclarator: ({print, node}) => [
      print(node.id),
      node.init && [
        Tokens.space(),
        Tokens.string('='),
        Tokens.space(),
        print(node.init),
      ],
    ],

    ObjectExpression: ({print, node}) => [
      Tokens.string('{'),
      Tokens.scopeOpen(),
      Tokens.scopeSpaceOrBreak(),
      map(node.properties, (property, i, arr) => [
        i > 0 && [Tokens.comma(), Tokens.scopeSpaceOrBreak()],
        print(property),
        i === arr.length - 1 && Tokens.scopeEmptyOrComma(),
      ]),
      Tokens.scopeSpaceOrBreak(),
      Tokens.scopeClose(),
      Tokens.string('}'),
    ],

    ObjectProperty: ({print, node}) => [
      print(node.key),
      Tokens.colon(),
      Tokens.space(),
      print(node.value),
    ],

    Identifier: ({node}) => Tokens.string(node.name),
  };
};
