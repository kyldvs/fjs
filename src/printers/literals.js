/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

export default {
  NumericLiteral: ({node}) => Tokens.string(node.extra.raw),
  StringLiteral: ({node}) => Tokens.string(node.extra.raw),
};
