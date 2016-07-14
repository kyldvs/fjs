/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {printList} from '../utils';

export default {
  ObjectProperty: ({print, node}) => [
    node.computed
      ? [
        Tokens.string('['),
        print(node.key),
        Tokens.string(']')
      ]
      : print(node.key),
    node.value.type === 'AssignmentPattern'
      ? [
        Tokens.space(),
        Tokens.string('='),
        Tokens.space(),
        print(node.value.right),
      ]
      : !node.shorthand && [
        Tokens.colon(),
        Tokens.space(),
        print(node.value),
      ],
  ],

  ObjectMethod: ({print, node}) => [
    node.kind === 'get' && [
      Tokens.string('get'),
      Tokens.space(),
    ],
    node.kind === 'set' && [
      Tokens.string('set'),
      Tokens.space(),
    ],
    node.async && [
      Tokens.string('async'),
      Tokens.space(),
    ],
    node.generator && Tokens.string('*'),
    node.computed
      ? [
        Tokens.string('['),
        print(node.key),
        Tokens.string(']')
      ]
      : print(node.key),
    Tokens.string('('),
    printList(node.params, print),
    Tokens.string(')'),
    print(node.returnType),
    Tokens.space(),
    print(node.body),
  ],
};
