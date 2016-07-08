/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';

export default {
  // let [a, b] = c;
  ArrayPattern: ({node, print}) => Printers.Array({
    elements: node.elements,
    print,
  }),

  // function foo(a = 1) {}
  AssignmentPattern: ({node, print}) => Printers.Assignment({
    left: node.left,
    right: node.right,
    print,
  }),

  // let {a, b: c} = d;
  ObjectPattern: ({node, print}) => Printers.Object({
    properties: node.properties,
    print,
  }),
};
