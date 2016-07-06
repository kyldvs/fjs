/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {map} from '../utils';

export default {
  // BlockStatement: ({node, print}) => [],
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
  // EmptyStatement: ({node, print}) => [],
  // ExportAllDeclaration: ({node, print}) => [],
  // ExportDefaultDeclaration: ({node, print}) => [],
  // ExportNamedDeclaration: ({node, print}) => [],

  ExpressionStatement: ({print, node}) => [
    print(node.expression),
    Tokens.semiColon(),
    Tokens.break(),
  ],

  // ForInStatement: ({node, print}) => [],
  // ForOfStatement: ({node, print}) => [],
  // ForStatement: ({node, print}) => [],
  // FunctionDeclaration: ({node, print}) => [],
  // IfStatement: ({node, print}) => [],
  // ImportDeclaration: ({node, print}) => [],
  // InterfaceDeclaration: ({node, print}) => [],
  // LabeledStatement: ({node, print}) => [],
  // ReturnStatement: ({node, print}) => [],
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
