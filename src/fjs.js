/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import type {Input, Output} from './types';

import * as babel from 'babel-core';
import format from './format';
import getPrinters from './getPrinters';
import getRules from './getRules';
import print from './print';

export default function fjs(input: Input): Output {
  const {ast} = babel.transform(input.code);
  const tokens = print(getPrinters(), ast);
  const code = format(getRules(), tokens);
  return {code};
}
