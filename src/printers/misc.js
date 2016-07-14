/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {printStatements} from '../utils';

export default {
  File: ({print, node}) => [
    print(node.program),
    // Files end with new lines. Strip the wrapping File node if you
    // need to format a subset of the AST that should not be treated as
    // an entire file.
    Tokens.break(),
  ],

  Program: ({print, node}) => [
    node.directives.length && [
      printStatements(node.directives, print),
      Tokens.string('\n'),
    ],
    printStatements(node.body, print),
  ],

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

  SpreadProperty: ({node, print}) => [
    Tokens.string('...'),
    print(node.argument),
  ],

  Directive: ({node, print}) => [
    print(node.value),
    Tokens.semiColon(),
    Tokens.break(),
  ],
};
