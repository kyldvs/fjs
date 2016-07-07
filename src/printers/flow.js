/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {printList} from '../utils';

export default {
  BooleanTypeAnnotation: () => Tokens.string('boolean'),
  StringTypeAnnotation: () => Tokens.string('string'),
  VoidTypeAnnotation: () => Tokens.string('void'),

  GenericTypeAnnotation: ({node, print}) => [
    print(node.id),
    print(node.typeParameters),
  ],

  TypeAnnotation: ({node, print}) => [
    Tokens.string(':'),
    Tokens.space(),
    print(node.typeAnnotation),
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
};
