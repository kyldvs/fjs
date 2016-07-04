/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

/**
 * Maps over the given array and then flattens by one level.
 */
export function flatMap(arr, fn) {
  return Array.prototype.concat.apply([], arr.map(fn));
}

/**
 * Flattens an array recursively until it contains no more arrays.
 */
export function flatten(arr) {
  while (arr.some(el => Array.isArray(el))) {
    arr = Array.prototype.concat.apply([], arr);
  }
  return arr;
}
