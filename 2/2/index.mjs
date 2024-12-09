import readline from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path'


const inputStream = createReadStream(path.join(import.meta.dirname, './input.txt'));

const input = readline.createInterface({ input: inputStream })

const leftColumn = [];
const rightColumn = {};

input.on('line', (line) => {
  const [leftValue, rightValue] = line.trim().split(/\s+/)

  leftColumn.push(leftValue);
  rightColumn[rightValue] = rightColumn[rightValue] ? rightColumn[rightValue] + 1 : 1
})


input.on('close', () => {
  inputStream.close();

  leftColumn.sort();

  let result = 0;

  for (let i = 0; i < leftColumn.length; i++) {
    const leftValue = leftColumn[i];

    const similarityScore = leftValue * (rightColumn[leftValue] ?? 0)

    result += similarityScore;
  }

  const outputStream = createWriteStream(path.join(import.meta.dirname, './output.txt'));
  outputStream.write(result.toString(), (error) => {
    if (error) {
      console.log(error);
    }

    outputStream.close();
  })
})

