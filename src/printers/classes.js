/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {printList, printStatements} from '../utils';

export default {
  ClassBody: ({node, print}) => [
    // TODO: Inner comments.
    Tokens.string('{'),
    Tokens.break(),
    Tokens.indent(),
    printStatements(node.body, print),
    Tokens.break(),
    Tokens.dedent(),
    Tokens.string('}'),
  ],

  ClassDeclaration: ({node, print}) => [
    Tokens.string('class'),
    Tokens.space(),
    print(node.id),
    print(node.typeParameters),
    Tokens.space(),
    node.superClass && [
      Tokens.string('extends'),
      Tokens.space(),
      print(node.superClass),
      print(node.superTypeParameters),
      Tokens.space(),
    ],
    print(node.body),
    Tokens.break(),
  ],

  ClassMethod: ({node, print}) => [
    node.static && [
      Tokens.string('static'),
      Tokens.space(),
    ],
    node.async && [
      Tokens.string('async'),
      Tokens.space(),
    ],
    print(node.key),
    Tokens.string('('),
    printList(node.params, print),
    Tokens.string(')'),
    print(node.returnType),
    Tokens.space(),
    print(node.body),
    Tokens.break(),
  ],

  ClassProperty: ({node, print}) => [
    node.static && [
      Tokens.string('static'),
      Tokens.space(),
    ],
    print(node.key),
    print(node.typeAnnotation),
    node.value && [
      Tokens.space(),
      Tokens.string('='),
      Tokens.space(),
      print(node.value),
    ],
    Tokens.semiColon(),
    Tokens.break(),
  ],
};
