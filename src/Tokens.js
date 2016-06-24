/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

const Tokens = {
  /**
   * Creates a simple string token.
   */
  string: (value) => ({
    type: 'string',
    value,
  }),

  /**
   * This creates a line. It must end in a newline to be syntactically correct.
   * Do not split this up over multiple lines.
   */
  line: (value) => ({
    type: 'line',
    value,
  }),
};

export default Tokens;
