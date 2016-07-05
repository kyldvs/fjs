/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

jest.autoMockOff();

import assert from 'assert';
import fjs from '../fjs/';
import fs from 'fs';
import path from 'path';

const FIXTURES_PATH = path.join(__dirname, '..', '__fixtures__');

// This allows you to easily focus on a single fixture or set of fixtures.
// When truthy, only fixtures with names that containe the DEBUG string
// will be run.
let DEBUG = null;
// DEBUG = 'works';

function buildFixtures(originalFilePath) {
  let arr = [];
  const filePaths = fs.readdirSync(originalFilePath);
  filePaths.forEach(fileName => {
    const filePath = path.join(originalFilePath, fileName);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      arr = [].concat(arr, buildFixtures(filePath));
    } else if (stats.isFile()) {
      if (
        filePath.endsWith('.in') &&
        (
          !DEBUG ||
          filePath.indexOf(DEBUG) !== -1
        )
      ) {
        const testName = fileName.slice(0, -3);
        const inPath = filePath;
        const outPath = filePath.slice(0, -3) + '.out';
        let inContents = fs.readFileSync(inPath, 'utf8');
        let outContents = null;
        try {
          outContents = fs.readFileSync(outPath, 'utf8');
        } catch (error) {
          it(testName, () => {
            assert(
              false,
              'Expected a corresponding output file to match the input ' +
              'file for "' +
              testName +
              '", but "' +
              outPath +
              '" does not exist. (or there was some error reading it)',
            );
          });
        }
        arr.push({
          name: testName,
          input: inContents,
          output: outContents,
        });
      }
    }
  });
  return arr;
}

describe('fjs', () => {
  buildFixtures(FIXTURES_PATH).forEach(fixture => {
    it(fixture.name, () => {
      const inputCode = fixture.input;
      const input = {code: inputCode};
      const output = fjs(input);
      const outputCode = output.code;
      expect(outputCode).toBe(fixture.output);
    });
  });
});
