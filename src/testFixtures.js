/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import assert from 'assert';
import fjs from './fjs/';
import fs from 'fs';
import path from 'path';

/**
 * This will run tests for a particular directory in the fixtures folder. It is
 * used to split up the snapshot files into meaningful categories so that it is
 * not one giant output file.
 */
export default function testFixtures(dir) {
  const fixturesPath = path.join(__dirname, '__fixtures__', dir);
  buildFixtures(fixturesPath).forEach(fixture => {
    it(fixture.name, () => {
      const inputCode = fixture.input;
      const input = {code: inputCode};
      const output = fjs(input);
      const outputCode = output.code;
      expect(outputCode).toMatchSnapshot();
    });
  });
}

function buildFixtures(originalFilePath) {
  let arr = [];
  const filePaths = fs.readdirSync(originalFilePath);
  filePaths.forEach(fileName => {
    const filePath = path.join(originalFilePath, fileName);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      arr = [].concat(arr, buildFixtures(filePath));
    } else if (stats.isFile()) {
      arr.push({
        name: fileName,
        input: fs.readFileSync(filePath, 'utf8'),
      });
    }
  });
  return arr;
}
