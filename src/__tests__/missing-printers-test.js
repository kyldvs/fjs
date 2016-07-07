/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

jest.autoMockOff();

import {VISITOR_KEYS} from 'babel-types';

import getPrinters from '../getPrinters';

/**
 * These are printers for nodes that aren't really part of the AST. At least,
 * babel doesn't include them in VISITOR_KEYS.
 */
const EXTRA_PRINTERS = new Set([
  'CommentBlock',
  'CommentLine',
]);

/**
 * These are the nodes we have not yet implemented. As printers are added for
 * these the test will throw an error if they are not removed here.
 */
const UNIMPLEMENTED = new Set([
  'AnyTypeAnnotation',
  'ArrayExpression',
  'ArrayPattern',
  'ArrayTypeAnnotation',
  'ArrowFunctionExpression',
  'AssignmentPattern',
  'AwaitExpression',
  'BindExpression',
  'BooleanLiteralTypeAnnotation',
  'BreakStatement',
  'CatchClause',
  'ClassExpression',
  'ClassImplements',
  'ConditionalExpression',
  'ContinueStatement',
  'DebuggerStatement',
  'DeclareClass',
  'DeclareFunction',
  'DeclareInterface',
  'DeclareModule',
  'DeclareTypeAlias',
  'DeclareVariable',
  'Decorator',
  'DoExpression',
  'DoWhileStatement',
  'ExistentialTypeParam',
  'ForInStatement',
  'ForOfStatement',
  'ForStatement',
  'FunctionExpression',
  'FunctionTypeAnnotation',
  'FunctionTypeParam',
  'InterfaceDeclaration',
  'InterfaceExtends',
  'IntersectionTypeAnnotation',
  'JSXAttribute',
  'JSXClosingElement',
  'JSXElement',
  'JSXEmptyExpression',
  'JSXExpressionContainer',
  'JSXIdentifier',
  'JSXMemberExpression',
  'JSXNamespacedName',
  'JSXOpeningElement',
  'JSXSpreadAttribute',
  'JSXText',
  'LabeledStatement',
  'LogicalExpression',
  'MetaProperty',
  'MixedTypeAnnotation',
  'NewExpression',
  'Noop',
  'NullableTypeAnnotation',
  'NullLiteralTypeAnnotation',
  'NumberTypeAnnotation',
  'NumericLiteralTypeAnnotation',
  'ObjectMethod',
  'ObjectPattern',
  'ObjectTypeAnnotation',
  'ObjectTypeCallProperty',
  'ObjectTypeIndexer',
  'ObjectTypeProperty',
  'ParenthesizedExpression',
  'QualifiedTypeIdentifier',
  'RegExpLiteral',
  'RestElement',
  'RestProperty',
  'SequenceExpression',
  'SpreadElement',
  'StringLiteralTypeAnnotation',
  'SwitchCase',
  'SwitchStatement',
  'TaggedTemplateExpression',
  'TemplateElement',
  'TemplateLiteral',
  'ThisTypeAnnotation',
  'ThrowStatement',
  'TryStatement',
  'TupleTypeAnnotation',
  'TypeAlias',
  'TypeCastExpression',
  'TypeofTypeAnnotation',
  'UnionTypeAnnotation',
  'UpdateExpression',
  'WhileStatement',
  'WithStatement',
  'YieldExpression',
]);

const PRINTERS = getPrinters();

describe('missing-printers', () => {
  Object.keys(VISITOR_KEYS).forEach(key => {
    if (!UNIMPLEMENTED.has(key)) {
      it('has printer for node type: ' + key, () => {
        expect(PRINTERS[key]).toBeTruthy();
      });
    } else {
      it('does not have printer for unimplemented node type: ' + key, () => {
        expect(PRINTERS[key]).not.toBeTruthy();
      });
    }
  });

  Object.keys(PRINTERS).forEach(key => {
    if (!EXTRA_PRINTERS.has(key)) {
      it('does not have printer for unknown node type: ' + key, () => {
        expect(VISITOR_KEYS[key]).toBeTruthy();
      });
    } else {
      it('has printer for "fake" node type: ' + key, () => {
        expect(VISITOR_KEYS[key]).not.toBeTruthy();
      });
    }
  });
});
