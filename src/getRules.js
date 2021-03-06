/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Tokens from './Tokens';

import assert from 'assert';
import {endsWithNewLine, hasNonWhitespace} from './regex';

// Higher priority is better.
const DEFAULT_PRIORITY = 1;
const SCOPE_PRIORITY = new Map([
  // Always break this if something needs to break.
  ['ternary', 4],
  ['logical_expressions', 2],
  ['binary_expressions', 2],
]);

// This is the penalty to the number of breaks for certain kinds of scopes.
// This prevents things like empty call expressions from having 2 free breaks.
// A lower penalty means more likely to break.
const DEFAULT_PENALTY = 0;
const SCOPE_BREAK_PENALTY = new Map([
  ['logical_expressions', 2],
  ['binary_expressions', 2],
]);

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
      // We will keep trying to break lines until they stop breaking.
      let someLinesBroke = true;
      while (someLinesBroke) {
        someLinesBroke = false;

        // First we need to recompute the lines.
        const lines = computeLines(tokens);

        // Compute the indentation of each line assuming there are no breaks.
        const indents = computeIndents(tokens, lines);

        // Figure out how many breaks are in each scope.
        const scopeBreaks = computeScopeBreaks(tokens);

        // Track the scopes to break.
        const scopesToBreak = new Set();

        for (let i = 0; i < lines.length; i++) {
          const [start, end] = lines[i];

          let alreadyHasBrokenScope = false;
          let spaceUsedByLine = indents[i] * 2;
          let scopeIndices = [];

          for (let j = start; j < end; j++) {
            if (tokens[j].scope) {
              scopeIndices.push(j);
              if (scopesToBreak.has(tokens[j].scopeID)) {
                alreadyHasBrokenScope = true;
                break;
              }
            }
            const token = tokens[j].scope ? tokens[j].unbroken : tokens[j];
            const spaceUsedByToken = measure(token);
            if (spaceUsedByToken > 0) {
              spaceUsedByLine += spaceUsedByToken;
            }
          }

          // Don't need to break something manually, some other line has caused
          // a scope in thie line to break. We will check that scope first.
          if (alreadyHasBrokenScope) {
            continue;
          }

          // TODO: We can track the spacing between token groups based to
          // help choose which scope to break. E.g. Scope 1 results in groups
          // of size (5, 10, 7, 8) which is evenly distributed, but Scope 2
          // has groups of size (1, 30, 1) which means it's a bad scope.

          // Now we need to find a scope to break in this line. For now we
          // naively select the first scope we see.
          if (
            spaceUsedByLine > options.maxLineLength &&
            scopeIndices.length > 0
          ) {

            let maxIndex = 0;
            let _maxKind = tokens[scopeIndices[maxIndex]].kind;
            let _maxID = tokens[scopeIndices[maxIndex]].scopeID;
            let _maxPriority = SCOPE_PRIORITY.has(_maxKind)
              ? SCOPE_PRIORITY.get(_maxKind)
              : DEFAULT_PRIORITY;
            let _maxPenalty = SCOPE_BREAK_PENALTY.has(_maxKind)
              ? SCOPE_BREAK_PENALTY.get(_maxKind)
              : DEFAULT_PENALTY;
            let _maxBreaks = scopeBreaks.get(_maxID) - _maxPenalty;
            let maxValue = _maxPriority * _maxBreaks;

            for (let j = 1; j < scopeIndices.length; j++) {
              const currIndex = j;
              const currToken = tokens[scopeIndices[currIndex]];
              const currID = currToken.scopeID;
              const currKind = currToken.kind;
              const currPriority = SCOPE_PRIORITY.has(currKind)
                ? SCOPE_PRIORITY.get(currKind)
                : DEFAULT_PRIORITY;
              const currPenalty = SCOPE_BREAK_PENALTY.has(currKind)
                ? SCOPE_BREAK_PENALTY.get(currKind)
                : DEFAULT_PENALTY;
              const currBreaks = scopeBreaks.get(currID) - currPenalty;
              const currValue = currPriority * currBreaks;

              if (currValue > maxValue) {
                maxIndex = currIndex;
                maxValue = currValue;
              }
            }

            scopesToBreak.add(tokens[scopeIndices[maxIndex]].scopeID);
          }
        }

        if (scopesToBreak.size > 0) {
          // Break the scopes.
          scopesToBreak.forEach(scopeID => {
            tokens = breakScopeID(tokens, scopeID);
          });
          someLinesBroke = true;
          scopesToBreak.clear();
        }
      }

      // TODO: Any call expressions (or other parenthesized things) that have
      // child scopes that break should also always break.

      return tokens;
    },

    // We are done breaking scopes, now mark all remaining scopes as unbroken.
    ({tokens}) => tokens.map(token => token.scope ? token.unbroken : token),

    // Remove extra breaks. Simplified for now, we need to traverse other
    // non printable characters to remove extra breaks in the future.
    ({tokens}) => {
      let seenBreak = false;
      return tokens.filter(token => {
        if (token.type === 'break') {
          if (seenBreak) {
            return false;
          } else {
            seenBreak = true;
            return true;
          }
        } else if (measure(token) > 0) {
          seenBreak = false;
        }
        return true;
      });
    },

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

        case 'period':
          return Tokens.string('.');

        case 'semiColon':
          return Tokens.string(';');

        case 'space':
          return Tokens.string(' ');

        case 'questionMark':
          return Tokens.string('?');

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

////////// Some private helpers used for scope breaking. //////////

function endOfLine(token) {
  if (token.scope) {
    return endOfLine(token.unbroken);
  }

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
    case 'period':
    case 'semiColon':
    case 'space':
    case 'questionMark':
      return 1;

    default:
      return 0;
  }
}

function breakScopeID(tokens, scopeID) {
  return tokens.map(token =>
    token.scopeID === scopeID
      ? token.broken
      : token
  );
}

/**
 * This will compute the lines based on token indices in the given array.
 *
 * Each line is: [token index inclusive, token index exclusive)
 */
function computeLines(tokens) {
  let lines = [];
  for (let i = 0; i < tokens.length; i++) {
    if (endOfLine(tokens[i]) || (i === tokens.length - 1)) {
      if (lines.length === 0) {
        lines.push([0, i + 1]);
      } else {
        lines.push([lines[lines.length - 1][1], i + 1]);
      }
    }
  }
  return lines;
}

/**
 * This computes the indentation of each line assuming no scopes break.
 */
function computeIndents(tokens, lines) {
  let indent = 0;
  return lines.map(line => {
    // Only capture the indent once we see a printable character.
    let capturedIndent = -1;
    for (let i = line[0]; i < line[1]; i++) {
      const token = tokens[i].scope ? tokens[i].unbroken : tokens[i];
      if (token.type === 'indent') {
        indent++;
      } else if (token.type === 'dedent') {
        indent--;
      }

      if (measure(token) > 0 && capturedIndent < 0) {
        capturedIndent = indent;
      }
    }
    return capturedIndent < 0 ? indent : capturedIndent;
  });
}

/**
 * Counts the number of breaks that would result from a scope breaking.
 */
function computeScopeBreaks(tokens) {
  const scopeBreaks = new Map();
  for (const token of tokens) {
    if (token.scope) {
      if (!scopeBreaks.has(token.scopeID)) {
        scopeBreaks.set(token.scopeID, 0);
      }
      if (token.broken.type === 'break') {
        scopeBreaks.set(token.scopeID, scopeBreaks.get(token.scopeID) + 1);
      }
    }
  }
  return scopeBreaks;
}
