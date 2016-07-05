/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import type {Input, Output} from './types';

import applyRules from './applyRules';
import * as babel from 'babel-core';
import getGlobalContext from './getGlobalContext';
import getMiddleware from './getMiddleware';
import getPrinters from './getPrinters';
import getRules from './getRules';
import print from './print';

export default function fjs(input: Input): Output {
  const {ast} = babel.transform(input.code);
  const tokens = print(
    getPrinters(),
    getMiddleware(),
    getGlobalContext(ast),
    ast,
  );
  const code = applyRules(getRules(), tokens);
  return {code};
}
