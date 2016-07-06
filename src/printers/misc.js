/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {map} from '../utils';

export default {
  File: ({print, node}) => [
    print(node.program),
    // Files end with new lines. Strip the wrapping File node if you
    // need to format a subset of the AST that should not be treated as
    // an entire file.
    Tokens.break(),
  ],

  Program: ({print, node}) => map(node.body, print),

  // Uncategorized / WIP

  VariableDeclarator: ({print, node}) => [
    print(node.id),
    node.init && [
      Tokens.space(),
      Tokens.string('='),
      Tokens.space(),
      print(node.init),
    ],
  ],

  ObjectProperty: ({print, node}) => [
    print(node.key),
    Tokens.colon(),
    Tokens.space(),
    print(node.value),
  ],

  Identifier: ({node}) => Tokens.string(node.name),
};
