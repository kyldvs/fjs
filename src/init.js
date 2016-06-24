/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import {register} from './Printers';

let _hasInit = false;

function init() {
  if (_hasInit) {
    return;
  }
  _hasInit = true;
  register('not-a-type', (ast) => []);
}

export default init;
