/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import assert from 'assert';

export default function applyRules(rules, originalTokens, context) {
  const finalTokens = rules.reduce(
    (tokens, rule) => rule({
      ...context,
      tokens,
    }),
    originalTokens,
  );

  // The final tokens must all be strings.
  finalTokens.forEach(token => {
    assert(
      token,
      'A final token is null. After running all rules all tokens must ' +
      'be string tokens.'
    );
    assert(
      token.type === 'string',
      'A final token has the type: "' +
      token.type +
      '". After running all rules all tokens must be string tokens.'
    );
  });

  // Concatenate them into the final result.
  return finalTokens.map(token => token.value).join('');
}
