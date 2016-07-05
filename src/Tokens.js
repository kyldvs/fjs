/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const Tokens = {
  semiColon: () => ({
    type: 'semiColon',
  }),

  string: (value) => ({
    type: 'string',
    value,
  }),
};

export default Tokens;
