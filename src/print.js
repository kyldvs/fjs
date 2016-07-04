/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import assert from 'assert';
import {flatten} from './utils';

export default function print(printers, outerN) {
  const doPrint = n => {
    if (!n || !n.type) {
      return [];
    }
    if (printers[n.type]) {
      // Assert that this returns an array? Or just handle it?
      return printers[n.type](doPrint, n);
    }
    assert(false, 'Unrecognized type: ' + n.type);
    return [];
  };
  return flatten(doPrint(outerN));
}
