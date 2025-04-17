// import readline from 'node:readline';
// import { createReadStream, createWriteStream } from 'node:fs';
// import path from 'node:path';
// import fs from 'node:fs/promises';
// import os from 'node:os';
// import { fileURLToPath } from 'node:url';

// const filePath = fileURLToPath(path.join(import.meta.resolve('./input.txt')));
// const file = await fs.readFile(filePath, 'utf8');
// const lines = file.split('\n');
// const content = lines.map((line) => line.split(''))

const TARGET = 'XMAS'
const LAST_TARGET_INDEX = TARGET.length - 1

let MAX_X = 0
let MAX_Y = 0
// let MAX_X = content[0].length - 1
// let MAX_Y = content.length - 1

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
const increaseCount = () => {
  const count = document.getElementById('count');

  resultCount += 1
  count.innerText = resultCount;
}

function* findNextLetter(content, x, y, currentLetterIndex, depthLevel = 1) {

  const letterNeighborsCoords = getCoordNeighbors(x, y, MAX_X, MAX_Y)

  for (const [neighborX, neighborY] of letterNeighborsCoords) {
    yield { x: neighborX, y: neighborY, depthLevel };

    const nextLetterIndex = currentLetterIndex + 1;


    if (content[neighborY][neighborX] !== TARGET[nextLetterIndex]) {
      continue;
    }

    if (nextLetterIndex === LAST_TARGET_INDEX) {
      increaseCount()
    } else {
      const generator = findNextLetter(content, neighborX, neighborY, nextLetterIndex, depthLevel + 1)

      for (const value of generator) {
        yield value;
      }
    }
  }
}

function* mainLoop(content) {
  for (let y = 0; y < content.length; y++) {
    for (let x = 0; x < content[y].length; x++) {
      const letter = content[y][x]

      if (letter !== TARGET[0]) {
        continue
      }

      yield { x, y, depthLevel: 0 }


      for (const value of findNextLetter(content, x, y, 0)) {
        const { x, y, depthLevel } = value;

        yield { x, y, depthLevel };
      }
    }
  }
}

const drawField = (field, content) => {
  for (let rowNum = 0; rowNum < content.length; rowNum++) {
    const row = content[rowNum]

    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    for (let letterNum = 0; letterNum < row.length; letterNum++) {
      const letter = content[rowNum][letterNum];

      const cell = document.createElement('div');
      cell.classList.add('cell');

      const textNode = document.createTextNode(letter)
      cell.append(textNode);

      rowElement.append(cell)
    }

    field.append(rowElement);
  }
}

const getFieldElementByCoords = ({ field, x, y }) => {
  return field.children[y].children[x];
}

async function main() {
  document.getElementById('load-file').addEventListener('click', async () => {
    const [fileHandle] = await window.showOpenFilePicker()
    const file = await fileHandle.getFile();
    const text = await file.text();

    const lines = text.split('\n');
    MAX_Y = lines.length - 1;

    const content = lines.map((line) => line.split(''))
    MAX_X = content[0].length - 1;

    const field = document.getElementById('field');
    drawField(field, content)

    let prevValue = null
    let timer = null;

    let timeoutTime = 500;
    const queueNextTick = () => {
      timer = setTimeout(() => {
        getNextValue()
        queueNextTick()
      }, timeoutTime)
    }

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null
      }
    }

    const loopGenerator = mainLoop(content);
    const ancestors = [];
    const getNextValue = () => {
      if (prevValue) {
        const { x, y } = prevValue;
        getFieldElementByCoords({ field, x, y }).classList.remove('active')
      }

      const { value, done } = loopGenerator.next()
      if (done || !value) {
        return;
      }

      const { x, y, depthLevel } = value;

      /**
       * Если глубина нового элемента больше, чем предыдущего - значит необходимо добавить предыдущий элемент в список предков
       */
      if (prevValue && depthLevel > prevValue.depthLevel) {
        ancestors.push(prevValue)
        getFieldElementByCoords({ field, x: prevValue.x, y: prevValue.y }).classList.add('parent')

        /**
         * Если глубина нового элемента меньше глубины предыдущего - необходимо удалить все элементы с глубиной,
         * меньшей чем у текущего элемента из списка предков и соответствующие стили с них
         */
      } else if (prevValue && depthLevel < prevValue.depthLevel) {
        while (ancestors.at(-1) && ancestors.at(-1).depthLevel + 1 > depthLevel) {
          const lastAncestor = ancestors.pop();
          getFieldElementByCoords({ field, x: lastAncestor.x, y: lastAncestor.y }).classList.remove('parent');
        }
      }

      getFieldElementByCoords({ field, x, y }).classList.add('active')

      prevValue = value;
    }


    const startButton = document.getElementById('start');
    startButton.addEventListener('click', () => {
      clearTimer();
      getNextValue()
      queueNextTick()
    })

    const nextStepButton = document.getElementById('nextStep');
    nextStepButton.addEventListener('click', () => {
      clearTimer();
      getNextValue();
    })


    const increaseSpeedButton = document.getElementById('increase-speed');
    increaseSpeedButton.addEventListener('click', () => {
      let wasTimerStarted = Boolean(timer);
      clearTimer();
      timeoutTime = Math.max(0, timeoutTime - 100);

      if (wasTimerStarted) {
        queueNextTick()
      }
    })

    const decreaseSpeedButton = document.getElementById('decrease-speed');
    decreaseSpeedButton.addEventListener('click', () => {
      let wasTimerStarted = Boolean(timer);
      clearTimer();
      timeoutTime = Math.min(1000, timeoutTime + 100);

      if (wasTimerStarted) {
        queueNextTick()
      }
    })

    const computeInstantlyButton = document.getElementById('compute-instantly');
    computeInstantlyButton.addEventListener('click', async () => {
      for (const _ of mainLoop(content)) {

      }
    })
  })

}

main()