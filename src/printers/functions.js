/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';
import Tokens from '../Tokens';

export default {
  FunctionDeclaration: ({node, print}) => [
    Printers.Function({
      async: !!node.async,
      body: node.body,
      generator: !!node.generator,
      id: node.id,
      params: node.params,
      print,
    }),
    Tokens.break(),
    Tokens.string('\n'),
  ],
};
