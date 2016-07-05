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
        !DEBUG ||
        filePath.indexOf(DEBUG) !== -1
      ) {
        arr.push({
          name: fileName,
          input: fs.readFileSync(filePath, 'utf8'),
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
      expect(outputCode).toMatchSnapshot();
    });
  });
});
