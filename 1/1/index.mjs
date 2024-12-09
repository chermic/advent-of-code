import readline from 'node:readline';
import fs from 'node:fs/promises';
import stream from 'node:stream/promises'
import { createReadStream, createWriteStream } from 'node:fs';


const inputStream = createReadStream(path.join(import.meta.dirname, './input.txt'));

const input = readline.createInterface({ input: inputStream })

const leftColumn = [];
const rightColumn = [];

input.on('line', (line) => {
  const [leftValue, rightValue] = line.trim().split(/\s+/)

  leftColumn.push(leftValue);
  rightColumn.push(rightValue);
})


input.on('close', () => {
  inputStream.close();

  leftColumn.sort();
  rightColumn.sort();

  let result = 0;

  for (let i = 0; i < leftColumn.length; i++) {
    const leftValue = leftColumn[i];
    const rightValue = rightColumn[i];

    const distance = Math.abs(leftValue - rightValue);

    result += distance;
  }

  const outputStream = createWriteStream(path.join(import.meta.dirname, './output.txt'));
  outputStream.write(result.toString(), (error) => {
    if (error) {
      console.log(error);
    }

    outputStream.close();
  })
})

