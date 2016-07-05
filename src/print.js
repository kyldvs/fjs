/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import assert from 'assert';
import {flatten} from './utils';

export default function print(printers, node) {
  const path = [node];
  const printFn = getPrintFn(printers, path);
  return flatten(printFn(node));
}

function getPrintFn(printers, originalPath) {
  return function printFn(node) {
    if (!node) {
      return [];
    }
    const type = node.type;
    if (!type) {
      return [];
    }
    const printer = printers[type];
    if (!printer) {
      assert(false, 'Unrecognized type: ' + type);
      return [];
    }
    const nextPath = [].concat(originalPath, node);
    const context = {
      path: nextPath,
      print: getPrintFn(printers, nextPath),
      node,
    };
    const result = printer(context);
    // Always make sure the result returned is an array.
    if (!Array.isArray(result)) {
      return [result];
    } else {
      return result;
    }
  };
}
