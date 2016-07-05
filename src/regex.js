/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

export function endsWithNewLine(value) {
  return /^.*\n$/.test(value);
}

export function hasNonWhitespace(value) {
  return /^.*\S$/.test(value);
}
