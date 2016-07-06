/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

import {map} from '../utils';

export default {
  ExportAllDeclaration: ({node, print}) => [],

  ExportDefaultDeclaration: ({node, print}) => [
    Tokens.string('export'),
    Tokens.space(),
    Tokens.string('default'),
    Tokens.space(),
    print(node.declaration),
  ],

  ExportDefaultSpecifier: ({node, print}) => [],
  ExportNamedDeclaration: ({node, print}) => [],
  ExportNamespaceSpecifier: ({node, print}) => [],
  ExportSpecifier: ({node, print}) => [],

  ImportDeclaration: ({node, print}) => [
    Tokens.string('import'),
    Tokens.space(),
    map(node.specifiers, (specifier, i) => [
      i > 0 && [Tokens.comma(), Tokens.space()],
      print(specifier),
    ]),
    Tokens.space(),
    Tokens.string('from'),
    Tokens.space(),
    print(node.source),
    Tokens.semiColon(),
    Tokens.break(),
  ],

  ImportDefaultSpecifier: ({node, print}) => print(node.local),

  ImportNamespaceSpecifier: ({node, print}) => [],
  ImportSpecifier: ({node, print}) => [],
};
