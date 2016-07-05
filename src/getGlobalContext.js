/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

/**
 * This is context that is available everywhere that never changes. This is how
 * you can pass arbitrary information built on the first print call to all other
 * printers, middleware, etc.
 */
export default function getGlobalContext(node) {
  return {
    options: {
      maxLineLength: 80,
    },
  };
};
