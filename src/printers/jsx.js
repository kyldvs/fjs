/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';
import Tokens from '../Tokens';

export default {
  JSXAttribute: ({node, print}) => [
    print(node.name),
    Tokens.string('='),
    node.value && [
      node.value.type === 'StringLiteral' && Printers.String({
        value: node.value.value,
        quotes: 'double',
      }),
      node.value.type !== 'StringLiteral' && print(node.value),
    ],
  ],

  JSXClosingElement: ({node, print}) => [
    Tokens.string('</'),
    print(node.name),
    Tokens.string('>'),
  ],

  JSXElement: ({node, print}) => [
    print(node.openingElement),
    node.children.length > 0 && [
      Tokens.scopeOpen('jsx_children'),
      node.children.map(child => {
        const childTokens = print(child);
        return [
          // Only insert the break if the child is printable. This is necessary
          // because there are "empty" JSXText nodes between every child.
          childTokens && Tokens.scopeEmptyOrBreak(),
          childTokens,
        ];
      }),
      Tokens.scopeEmptyOrBreak(),
      Tokens.scopeClose(),
    ],
    print(node.closingElement),
  ],

  JSXEmptyExpression: () => [],

  JSXExpressionContainer: ({node, print}) => [
    Tokens.string('{'),
    Tokens.scopeOpen('jsx_expression_container'),
    Tokens.scopeEmptyOrBreak(),
    print(node.expression),
    Tokens.scopeEmptyOrBreak(),
    Tokens.scopeClose(),
    Tokens.string('}'),
  ],

  JSXIdentifier: ({node}) => Tokens.string(node.name),

  JSXMemberExpression: ({node, print}) => [
    print(node.object),
    Tokens.period(),
    print(node.property),
  ],

  JSXNamespacedName: ({node, print}) => [
    print(node.namespace),
    Tokens.colon(),
    print(node.name),
  ],

  JSXOpeningElement: ({node, print}) => [
    Tokens.string('<'),
    print(node.name),
    node.attributes.length && [
      Tokens.scopeOpen('jsx_attributes'),
      node.attributes.map(attribute => [
        Tokens.scopeSpaceOrBreak(),
        print(attribute),
      ]),
      node.selfClosing && Tokens.scopeSpaceOrBreak(),
      Tokens.scopeClose(),
    ],
    (!node.attributes.length) && node.selfClosing && Tokens.space(),
    node.selfClosing && Tokens.string('/'),
    Tokens.string('>'),
  ],

  JSXSpreadAttribute: ({node, print}) => [
    Tokens.string('{'),
    Tokens.string('...'),
    print(node.argument),
    Tokens.string('}'),
  ],

  JSXText: ({node}) => node.value.trim()
    ? Tokens.string(node.value.trim())
    : null,
};
