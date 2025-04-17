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

/**
 * 
 * @param {number} x - координата x
 * @param {number} y - координата y
 * @returns {{x: number, y: number, direction: {x: number, y: number}}[]}
 */
const getCoordNeighbors = (x, y) => {
  const restLettersCount = TARGET.length - 1

  const isXGreaterThanMinimum = x >= restLettersCount
  const isYGreaterThanMinimum = y >= restLettersCount
  const isXLessThanMaximum = x < MAX_X - restLettersCount
  const isYLessThanMaximum = y < MAX_Y - restLettersCount

  return [
    isXGreaterThanMinimum && isYGreaterThanMinimum ? { x: x - 1, y: y - 1, direction: { x: -1, y: -1 } } : null,
    isYGreaterThanMinimum ? { x: x, y: y - 1, direction: { x: 0, y: -1 } } : null,
    isXLessThanMaximum && isYGreaterThanMinimum ? { x: x + 1, y: y - 1, direction: { x: 1, y: -1 } } : null,
    isXGreaterThanMinimum ? { x: x - 1, y, direction: { x: -1, y: 0 } } : null,
    isXLessThanMaximum ? { x: x + 1, y, direction: { x: 1, y: 0 } } : null,
    isXGreaterThanMinimum && isYLessThanMaximum ? { x: x - 1, y: y + 1, direction: { x: -1, y: 1 } } : null,
    isYLessThanMaximum ? { x: x, y: y + 1, direction: { x: 0, y: 1 } } : null,
    isXLessThanMaximum && isYLessThanMaximum ? { x: x + 1, y: y + 1, direction: { x: 1, y: 1 } } : null
  ].filter(Boolean)
}

/**
 * 
 * @param {{x: number, y: number}} coords Координаты в формате {x: number, y: number}
 * @param {{x: -1 | 0 | 1, y: -1 | 0 | 1}} direction Направление поиска в формате {x: number, y: number}, где x и y могут быть значениями от -1 до 1
 * @returns {{x: number, y: number}} Координаты {x, y} следующей ячейки
 */
const getNextLetterCoords = (coords, direction) => {
  return { x: coords.x + direction.x, y: coords.y + direction.y }
}

/**
 * 
 * @param {{content: number[][], x: number, y: number}} parameters 
 * @returns 
 */
const getLetterByCoords = ({ content, x, y }) => {
  return content[y][x]
}

let resultCount = 0

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} currentLetterIndex 
 * @param {number} count 
 * @returns 
 */
const findNextLetter = (x, y, currentLetterIndex, count) => {
  const letterNeighborsCoords = getCoordNeighbors(x, y)
  const nextLetterIndex = currentLetterIndex + 1;

  for (const [neighborX, neighborY] of letterNeighborsCoords) {
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
    if (getLetterByCoords({ content, x, y }) !== TARGET[0]) {
      continue
    }

    const letterNeighborsCoords = getCoordNeighbors(x, y)

    for (const neighbor of letterNeighborsCoords) {
      const neighborLetter = getLetterByCoords({ content, x: neighbor.x, y: neighbor.y });

      if (neighborLetter !== TARGET[1]) {
        continue;
      }

      let currentLetterIndex = 2;

      let letterCoords = getNextLetterCoords({ x: neighbor.x, y: neighbor.y }, { x: neighbor.direction.x, y: neighbor.direction.y })
      let letter = getLetterByCoords({ content, x: letterCoords.x, y: letterCoords.y });
      while (letter === TARGET[currentLetterIndex]) {
        if (currentLetterIndex === TARGET.length - 1) {
          resultCount += 1;
          break;
        }

        currentLetterIndex += 1;
        const nextLetterCoords = getNextLetterCoords({ x: letterCoords.x, y: letterCoords.y }, { x: neighbor.direction.x, y: neighbor.direction.y })
        letter = getLetterByCoords({ content, x: nextLetterCoords.x, y: nextLetterCoords.y });
      }
    }
  }
}

console.log(resultCount)