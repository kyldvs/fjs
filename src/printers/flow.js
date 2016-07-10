/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';
import Tokens from '../Tokens';

import assert from 'assert';
import {printList} from '../utils';

export default {
  AnyTypeAnnotation: () => Tokens.string('any'),

  BooleanTypeAnnotation: () => Tokens.string('boolean'),

  BooleanLiteralTypeAnnotation: ({node}) => node.value
    ? Tokens.string('true')
    : Tokens.string('false'),

  GenericTypeAnnotation: ({node, print}) => [
    print(node.id),
    print(node.typeParameters),
  ],

  MixedTypeAnnotation: () => Tokens.string('mixed'),

  NullableTypeAnnotation: ({node, print}) => [
    Tokens.questionMark(),
    print(node.typeAnnotation),
  ],

  NullLiteralTypeAnnotation: () => Token.string('null'),

  NumberTypeAnnotation: () => Tokens.string('number'),

  NumericLiteralTypeAnnotation: ({node}) => Tokens.string(node.extra.raw),

  StringLiteralTypeAnnotation: ({node}) => Printers.String({
    value: node.value,
    quotes: 'single',
  }),

  StringTypeAnnotation: () => Tokens.string('string'),

  ThisTypeAnnotation: () => Tokens.string('this'),

  TupleTypeAnnotation: ({node, print}) => [
    Tokens.string('['),
    printList(node.types, print),
    Tokens.string(']'),
  ],

  TypeAlias: ({node, print}) => [
    Tokens.string('type'),
    Tokens.space(),
    print(node.id),
    print(node.typeParameters),
    Tokens.space(),
    Tokens.string('='),
    Tokens.space(),
    print(node.right),
    Tokens.semiColon(),
    Tokens.break(),
  ],

  TypeAnnotation: ({node, print}) => [
    Tokens.string(':'),
    Tokens.space(),
    print(node.typeAnnotation),
  ],

  TypeCastExpression: ({node, print}) => [
    Tokens.string('('),
    print(node.expression),
    print(node.typeAnnotation),
    Tokens.string(')'),
  ],

  TypeofTypeAnnotation: ({node, print}) => [
    Tokens.string('typeof'),
    Tokens.space(),
    print(node.argument),
  ],

  TypeParameter: ({node, print}) => [
    node.variance === 'plus' && Tokens.string('+'),
    node.variance === 'minus' && Tokens.string('-'),
    Tokens.string(node.name),
    print(node.bound),
  ],

  TypeParameterDeclaration: ({node, print}) => [
    Tokens.string('<'),
    printList(node.params, print),
    Tokens.string('>'),
  ],

  TypeParameterInstantiation: ({node, print}) => [
    Tokens.string('<'),
    printList(node.params, print),
    Tokens.string('>'),
  ],

  VoidTypeAnnotation: () => Tokens.string('void'),
};
