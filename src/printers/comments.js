/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from '../Tokens';

export default {
  CommentLine: ({node}) => [
    Tokens.string('//'),
    Tokens.string(node.value),
  ],

  CommentBlock: ({node}) => [
    Tokens.string('/*'),
    Tokens.string(node.value),
    Tokens.string('*/'),
  ],
};
