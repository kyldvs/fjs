/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import comments from './printers/comments';
import expressions from './printers/expressions';
import literals from './printers/literals';
import misc from './printers/misc';
import statements from './printers/statements';

/**
 * Printers convert an AST into tokens which may then be formatted.
 */
export default function getPrinters() {
  return {
    ...comments,
    ...expressions,
    ...literals,
    ...misc,
    ...statements,
  };
};
