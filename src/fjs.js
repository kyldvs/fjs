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
  const {ast} = babel.transform(input.code, {
    plugins: [
      'syntax-flow',
      'syntax-jsx',
      'syntax-object-rest-spread',
      'syntax-trailing-function-commas',
      'babel-plugin-syntax-async-functions',
    ],
  });
  const globalContext = getGlobalContext(ast);
  const tokens = print(
    getPrinters(),
    getMiddleware(),
    globalContext,
    ast,
  );
  const code = applyRules(getRules(), tokens, globalContext);
  return {code};
}
