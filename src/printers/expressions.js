/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {map} from '../utils';

export default {
  // ArrayExpression: ({node, print}) => [],
  // ArrowFunctionExpression: ({node, print}) => [],

  AssignmentExpression: ({node, print}) => [
    print(node.left),
    Tokens.space(),
    Tokens.string('='),
    Tokens.space(),
    print(node.right),
  ],

  // AwaitExpression: ({node, print}) => [],

  BinaryExpression: ({node, print}) => [
    print(node.left),
    Tokens.space(),
    Tokens.string(node.operator),
    Tokens.space(),
    print(node.right),
  ],

  // BindExpression: ({node, print}) => [],
  // CallExpression: ({node, print}) => [],
  // ClassExpression: ({node, print}) => [],
  // ConditionalExpression: ({node, print}) => [],
  // DoExpression: ({node, print}) => [],
  // FunctionExpression: ({node, print}) => [],
  // JSXEmptyExpression: ({node, print}) => [],
  // JSXMemberExpression: ({node, print}) => [],
  // LogicalExpression: ({node, print}) => [],
  // MemberExpression: ({node, print}) => [],
  // NewExpression: ({node, print}) => [],

  ObjectExpression: ({node, print}) => [
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

  // ParenthesizedExpression: ({node, print}) => [],
  // SequenceExpression: ({node, print}) => [],
  // TaggedTemplateExpression: ({node, print}) => [],
  // ThisExpression: ({node, print}) => [],
  // TypeCastExpression: ({node, print}) => [],
  // UnaryExpression: ({node, print}) => [],
  // UpdateExpression: ({node, print}) => [],
  // YieldExpression: ({node, print}) => [],
};
