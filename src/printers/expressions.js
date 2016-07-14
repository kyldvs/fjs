/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';
import Tokens from '../Tokens';

import {map, printList} from '../utils';

export default {
  ArrayExpression: ({node, print}) => Printers.Array({
    elements: node.elements,
    print,
  }),

  // ArrowFunctionExpression: ({node, print}) => [],

  AssignmentExpression: ({node, print}) => Printers.Assignment({
    left: node.left,
    right: node.right,
    print,
  }),

  AwaitExpression: ({node, print}) => [
    Tokens.string('await'),
    Tokens.space(),
    print(node.argument),
  ],

  BinaryExpression: ({node, path, print}) => {
    const parenthesized = node.extra && node.extra.parenthesized;

    let hasParentBinaryExpression = false;

    // Note: We don't check the last node, it's always a LogicalExpression since
    // that's the node we are printing.
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] && path[i].type === 'BinaryExpression') {
        hasParentBinaryExpression = true;
        break;
      }
    }

    const createScope = !hasParentBinaryExpression && !parenthesized;

    return [
      parenthesized && Tokens.string('('),
      parenthesized && Tokens.scopeOpen('binary_expressions'),
      createScope && Tokens.scopeOpenNoIndent('binary_expressions'),

      Tokens.scopeEmptyOrBreak(),
      print(node.left),
      Tokens.space(),
      Tokens.string(node.operator),
      Tokens.scopeSpaceOrBreak(),
      print(node.right),

      createScope && Tokens.scopeCloseNoDedent(),
      parenthesized && Tokens.scopeEmptyOrBreak(),
      parenthesized && Tokens.scopeClose(),
      parenthesized && Tokens.string(')'),
    ];
  },

  BindExpression: ({node, print}) => [
    print(node.object),
    Tokens.colon(),
    Tokens.colon(),
    print(node.callee),
  ],

  CallExpression: ({node, print}) => [
    print(node.callee),
    Tokens.string('('),
    printList(node.arguments, print, 'call_expression'),
    Tokens.string(')'),
  ],

  // ClassExpression: ({node, print}) => [],

  ConditionalExpression: ({node, print}) => [
    print(node.test),
    Tokens.scopeOpen('ternary'),
    Tokens.scopeSpaceOrBreak(),
    Tokens.questionMark(),
    Tokens.space(),
    print(node.consequent),
    Tokens.scopeSpaceOrBreak(),
    Tokens.colon(),
    Tokens.space(),
    print(node.alternate),
    Tokens.scopeClose(),
  ],

  // DoExpression: ({node, print}) => [],
  // FunctionExpression: ({node, print}) => [],

  Identifier: ({node, print}) => [
    Tokens.string(node.name),
    print(node.typeAnnotation),
  ],

  LogicalExpression: ({node, path, print}) => {
    const parenthesized = node.extra && node.extra.parenthesized;

    let hasParentLogicalExpression = false;

    // Note: We don't check the last node, it's always a LogicalExpression since
    // that's the node we are printing.
    for (let i = 0; i < path.length - 1; i++) {
      if (path[i] && path[i].type === 'LogicalExpression') {
        hasParentLogicalExpression = true;
        break;
      }
    }

    const createScope = !hasParentLogicalExpression && !parenthesized;

    // TODO: This part is basically untested... make some logical chains inside
    // of ifs and function calls, etc.

    // This determines if while breaking the scope we need to add parens or not.
    // For example a naked series of logical expressions will need parenthesis
    // added to them.
    const createScopeParens = createScope && !path.some(pn => pn && (
      (
        pn.type === 'CallExpression' &&
        pn.arguments.some(argument => argument === node)
      ) ||
      (
        pn.type === 'IfStatement' &&
        pn.test === node
      )
    ));

    return [
      parenthesized && Tokens.string('('),
      parenthesized && Tokens.scopeOpen('logical_expressions'),
      createScope && Tokens.scopeOpenNoIndent('logical_expressions'),
      createScopeParens && Tokens.scopeEmptyOrOpenParen(),
      createScope && Tokens.scopeEmptyOrIndent(),

      Tokens.scopeEmptyOrBreak(),
      print(node.left),
      Tokens.space(),
      Tokens.string(node.operator),
      Tokens.scopeSpaceOrBreak(),
      print(node.right),

      createScope && Tokens.scopeEmptyOrBreak(),
      createScope && Tokens.scopeEmptyOrDedent(),
      createScopeParens && Tokens.scopeEmptyOrCloseParen(),
      createScope && Tokens.scopeCloseNoDedent(),
      parenthesized && Tokens.scopeEmptyOrBreak(),
      parenthesized && Tokens.scopeClose(),
      parenthesized && Tokens.string(')'),
    ];
  },

  MemberExpression: ({node, print}) => [
    print(node.object),
    node.computed && Tokens.string('['),
    (!node.computed) && Tokens.period(),
    print(node.property),
    node.computed && Tokens.string(']'),
  ],

  // NewExpression: ({node, print}) => [],

  ObjectExpression: ({node, print}) => Printers.Object({
    properties: node.properties,
    print,
  }),

  // ParenthesizedExpression: ({node, print}) => [],
  // SequenceExpression: ({node, print}) => [],

  Super: () => Tokens.string('super'),

  // TaggedTemplateExpression: ({node, print}) => [],

  ThisExpression: () => Tokens.string('this'),

  UnaryExpression: ({node, print}) => [
    node.prefix && Tokens.string(node.operator),
    node.extra.parenthesizedArgument && Tokens.string('('),
    print(node.argument),
    node.extra.parenthesizedArgument && Tokens.string(')'),
    (!node.prefix) && Tokens.string(node.operator),
  ],

  UpdateExpression: ({node, print}) => [
    node.prefix && Tokens.string(node.operator),
    print(node.argument),
    (!node.prefix) && Tokens.string(node.operator),
  ],

  // YieldExpression: ({node, print}) => [],
};
