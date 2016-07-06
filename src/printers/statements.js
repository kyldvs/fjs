/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {map, printList, printStatements} from '../utils';

export default {
  BlockStatement: ({node, print}) => [
    Tokens.string('{'),
    Tokens.break(),
    Tokens.indent(),
    printStatements(node.body, print),
    Tokens.break(),
    Tokens.dedent(),
    Tokens.string('}'),
  ],

  // BreakStatement: ({node, print}) => [],
  // ClassDeclaration: ({node, print}) => [],
  // ContinueStatement: ({node, print}) => [],
  // DebuggerStatement: ({node, print}) => [],
  // DeclareClass: ({node, print}) => [],
  // DeclareFunction: ({node, print}) => [],
  // DeclareInterface: ({node, print}) => [],
  // DeclareModule: ({node, print}) => [],
  // DeclareTypeAlias: ({node, print}) => [],
  // DeclareVariable: ({node, print}) => [],
  // DoWhileStatement: ({node, print}) => [],

  EmptyStatement: ({node, print}) => Tokens.semiColon(),

  ExpressionStatement: ({print, node}) => [
    print(node.expression),
    Tokens.semiColon(),
    Tokens.break(),
  ],

  // ForInStatement: ({node, print}) => [],
  // ForOfStatement: ({node, print}) => [],
  // ForStatement: ({node, print}) => [],

  FunctionDeclaration: ({node, print}) => [
    Tokens.string('function'),
    Tokens.space(),
    print(node.id),
    Tokens.string('('),
    printList(node.params, print),
    Tokens.string(')'),
    Tokens.space(),
    print(node.body),
  ],

  // IfStatement: ({node, print}) => [],
  // InterfaceDeclaration: ({node, print}) => [],
  // LabeledStatement: ({node, print}) => [],

  ReturnStatement: ({node, print}) => [
    Tokens.string('return'),
    node.argument != null && [
      Tokens.space(),
      print(node.argument),
    ],
    Tokens.semiColon(),
    Tokens.break(),
  ],

  // SwitchStatement: ({node, print}) => [],
  // ThrowStatement: ({node, print}) => [],
  // TryStatement: ({node, print}) => [],
  // TypeAlias: ({node, print}) => [],

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

  // WhileStatement: ({node, print}) => [],
  // WithStatement: ({node, print}) => [],
};
