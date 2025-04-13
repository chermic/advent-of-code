import readline from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const filePath = fileURLToPath(path.join(import.meta.resolve('./input.txt')));
const file = await fs.readFile(filePath, 'utf8');
const lines = file.split('\n');
const content = lines.map((line) => line.split(''))

const TARGET = 'XMAS'
const LAST_TARGET_INDEX = TARGET.length - 1

const MAX_X = content[0].length - 1
const MAX_Y = content.length - 1

const getCoordNeighbors = (x, y) => {
  const isXGreaterThanZero = x > 0
  const isYGreaterThanZero = y > 0
  const isXLessThanMax = x < MAX_X
  const isYLessThanMax = y < MAX_Y

  return [
    isXGreaterThanZero && isYGreaterThanZero ? [x - 1, y - 1] : null,
    isYGreaterThanZero ? [x, y - 1] : null,
    isXLessThanMax && isYGreaterThanZero ? [x + 1, y - 1] : null,
    isXGreaterThanZero ? [x - 1, y] : null,
    isXLessThanMax ? [x + 1, y] : null,
    isXGreaterThanZero && isYLessThanMax ? [x - 1, y + 1] : null,
    isYLessThanMax ? [x, y + 1] : null,
    isXLessThanMax && isYLessThanMax ? [x + 1, y + 1] : null
  ].filter(Boolean)
}

let resultCount = 0

const findNextLetter = (x, y, currentLetterIndex, count) => {
  const letterNeighborsCoords = getCoordNeighbors(x, y)
  const nextLetterIndex = currentLetterIndex + 1;

  for (const [neighborX, neighborY] of letterNeighborsCoords) {
    // console.log({ count, neighborX, neighborY, currentLetterIndex, x, y })
    if (content[neighborY][neighborX] === TARGET[nextLetterIndex]) {
      if (nextLetterIndex === LAST_TARGET_INDEX) {
        return count + 1
      }

      return findNextLetter(neighborX, neighborY, currentLetterIndex + 1, count)
    }
  }

  return 0
}

for (let y = 0; y < content.length; y++) {
  for (let x = 0; x < content[y].length; x++) {
    const letter = content[y][x]

    if (letter !== TARGET[0]) {
      continue
    }


    resultCount += findNextLetter(x, y, 0, 0)
  }
}

console.log(resultCount)