/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import assert from 'assert';
import {flatten} from './utils';

export default function print(printers, middleware, globalContext, node) {
  const path = [node];
  const applyMiddleware = getApplyMiddlewareFn(middleware);
  const printFn = getPrintFn(printers, applyMiddleware, path);
  return flatten(printFn(node));
}

function getPrintFn(printers, applyMiddleware, globalContext, originalPath) {
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
    const printerContext = {
      ...globalContext,
      path: nextPath,
      print: getPrintFn(printers, applyMiddleware, globalContext, nextPath),
      node,
    };
    const tokens = flatten(printer(printerContext));
    const result = applyMiddleware(printerContext, tokens);
    return flatten(result);
  };
}

function getApplyMiddlewareFn(middleware) {
  const middlewareArray = Object.keys(middleware).map(key => middleware[key]);
  return function applyMiddleware(printerContext, originalTokens) {
    const result = middlewareArray.reduce(
      (tokens, middlewareToApply) => flatten(middlewareToApply({
        ...printerContext,
        tokens,
      })),
      originalTokens,
    );
    return result;
  };
}
