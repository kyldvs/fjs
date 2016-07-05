/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import assert from 'assert';
import {endsWithNewLine, hasNonWhitespace} from './regex';

/**
 * Rules convert an array of tokens into another array of tokens. Rules
 * are run in the particular order they are defined. Once all rules are
 * run all tokens must be string tokens.
 */
export default function getRules() {
  return [
    ({tokens}) => tokens.filter(token => !!token),

    // First assign ids to all the scopes.
    ({tokens}) => {
      let id = 1;
      const stack = [];
      const push = () => { stack.push(id++); };
      const pop = () => { stack.pop(); };
      const peek = () => stack[stack.length - 1];
      return tokens.map(token => {
        let scopeID = null;
        if (token.type === 'scopeOpen') {
          push();
          scopeID = peek();
        } else if (token.type === 'scopeClose') {
          scopeID = peek();
          pop();
        } else if (token.scope) {
          scopeID = peek();
        }

        if (token.scope) {
          return {
            ...token,
            scopeID,
          };
        } else {
          return token;
        }
      });
    },

    // Rudementary scope breaking.
    ({tokens, options}) => {
      function shouldReset(token) {
        switch (token.type) {
          case 'string':
            return endsWithNewLine(token.value);

          case 'break':
            return true;

          default:
            return false;
        }
      }

      function measure(token) {
        // Measure the unbroken side of a scope token.
        if (token.scope) {
          return measure(token.unbroken);
        }

        switch (token.type) {
          case 'string':
            return token.value.length;

          case 'colon':
          case 'comma':
          case 'semiColon':
          case 'space':
            return 1;

          default:
            return 0;
        }
      }

      function resolveBrokenTokens(tokens) {
        return tokens.map(token =>
          token.scope
            ? token.isBroken
              ? token.broken
              : token.unbroken
            : token
        );
      }

      function breakScopeID(tokens, scopeID) {
        return tokens.map(token =>
          token.scopeID === scopeID
            ? { ...token, isBroken: true }
            : token
        );
      }

      let indent = 0;
      let space = 0;
      let somethingBroke = true;
      while (somethingBroke) {
        space = options.maxLineLength;
        somethingBroke = false;
        for (let i = 0; i < tokens.length; i++) {
          space = space - measure(tokens[i]);
          if (space < 0) {
            for (let j = i; j >= 0; j--) {
              if (tokens[j].scope) {
                tokens = breakScopeID(tokens, tokens[j].scopeID);
                somethingBroke = true;
                break;
              }
            }
            // If we didn't change anything we just have to deal with the fact
            // that this line will be over the limit.
            if (somethingBroke) {
              break;
            }
          }
          if (shouldReset(tokens[i])) {
            space = options.maxLineLength;
          }
        }
        if (somethingBroke) {
          tokens = resolveBrokenTokens(tokens);
        }
      }

      return tokens;
    },

    // Actualize the scopes, no scope tokens should remain after this.
    ({tokens}) => tokens.map(token => {
      if (token.scope) {
        if (token.isBroken) {
          return token.broken;
        } else {
          return token.unbroken;
        }
      } else {
        return token;
      }
    }),

    // Remove extra breaks. Simplified for now, we need to traverse other
    // non printable characters to remove extra breaks in the future.
    ({tokens}) => tokens.filter((token, i) => (
      token.type !== 'break' ||
      (
        i > 0 &&
        tokens[i - 1].type !== 'break'
      )
    )),

    // Map the final tokens back to strings and indentation.
    ({tokens}) => tokens.map(token => {
      switch (token.type) {
        case 'break':
          return Tokens.string('\n');

        case 'colon':
          return Tokens.string(':');

        case 'comma':
          return Tokens.string(',');

        case 'empty':
          return Tokens.string('');

        case 'semiColon':
          return Tokens.string(';');

        case 'space':
          return Tokens.string(' ');

        case 'indent':
        case 'dedent':
        case 'string':
          return token;

        default:
          assert(false, 'Unhandled token type while printing: ' + token.type);
          return null;
      }
    }),

    // Handle indentation. Now everything should be strings.
    ({tokens}) => {
      let indent = 0;
      let canIndent = false;
      return tokens.map(token => {
        if (token.type === 'indent') {
          indent++;
          return null;
        }

        if (token.type === 'dedent') {
          indent--;
          return null;
        }

        if (token.type === 'string') {
          const value = token.value;
          let result = token;
          // If we canIndent, and there is some non-whitespace character in
          // this token, indent then set canIndent to false.
          if (canIndent && indent > 0 && hasNonWhitespace(value)) {
            result = Tokens.string('  '.repeat(indent) + value);
            canIndent = false;
          }
          if (endsWithNewLine(value)) {
            canIndent = true;
          }
          return result;
        }

        assert(false, 'Unhandled token type while indenting: ' + token.type);
        return null;
      });
    },

    ({tokens}) => tokens.filter(token => !!token),
  ];
};
