/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {map, printList} from '../utils';

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

  CallExpression: ({node, print}) => [
    print(node.callee),
    Tokens.string('('),
    node.arguments && node.arguments.length && printList(node.arguments, print),
    Tokens.string(')'),
  ],

  // ClassExpression: ({node, print}) => [],
  // ConditionalExpression: ({node, print}) => [],
  // DoExpression: ({node, print}) => [],
  // FunctionExpression: ({node, print}) => [],

  Identifier: ({node, print}) => [
    Tokens.string(node.name),
    print(node.typeAnnotation),
  ],

  // JSXEmptyExpression: ({node, print}) => [],
  // JSXMemberExpression: ({node, print}) => [],
  // LogicalExpression: ({node, print}) => [],

  MemberExpression: ({node, print}) => [
    print(node.object),
    node.computed && Tokens.string('['),
    (!node.computed) && Tokens.period(),
    print(node.property),
    node.computed && Tokens.string(']'),
  ],

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

  Super: () => Tokens.string('super'),

  // TaggedTemplateExpression: ({node, print}) => [],

  ThisExpression: () => Tokens.string('this'),

  // TypeCastExpression: ({node, print}) => [],

  UnaryExpression: ({node, print}) => [
    node.prefix && Tokens.string(node.operator),
    node.extra.parenthesizedArgument && Tokens.string('('),
    print(node.argument),
    node.extra.parenthesizedArgument && Tokens.string(')'),
    (!node.prefix) && Tokens.string(node.operator),
  ],

  // UpdateExpression: ({node, print}) => [],
  // YieldExpression: ({node, print}) => [],
};
