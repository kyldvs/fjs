/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

/**
 * Maps over the given array, checks for null first.
 */
export function map(arr, fn) {
  return arr && arr.map(fn);
}

/**
 * Flattens an array recursively until it contains no more arrays.
 */
export function flatten(arr) {
  if (!Array.isArray(arr)) {
    return [arr];
  }
  while (arr.some(el => Array.isArray(el))) {
    arr = Array.prototype.concat.apply([], arr);
  }
  return arr;
}
