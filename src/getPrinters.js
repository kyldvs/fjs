/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import classes from './printers/classes';
import comments from './printers/comments';
import expressions from './printers/expressions';
import flow from './printers/flow';
import importExport from './printers/importExport';
import jsx from './printers/jsx';
import literals from './printers/literals';
import misc from './printers/misc';
import object from './printers/object';
import obsolete from './printers/obsolete';
import patterns from './printers/patterns';
import statements from './printers/statements';

/**
 * Printers convert an AST into tokens which may then be formatted.
 */
export default function getPrinters() {
  return {
    ...classes,
    ...comments,
    ...expressions,
    ...flow,
    ...importExport,
    ...jsx,
    ...literals,
    ...misc,
    ...object,
    ...obsolete,
    ...patterns,
    ...statements,
  };
};
