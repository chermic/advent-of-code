import readline from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';


const inputStream = createReadStream(path.join(import.meta.dirname, './input.txt'));

const input = readline.createInterface({ input: inputStream })

const allMultipliers = [];

input.on('line', (line) => {
  const multipliers = line.trim().matchAll(/(mul\(\d{1,3}\,\d{1,3}\))|(do\(\))|(don't\(\))/g);
  for (const multiplier of multipliers) {
    console.log('🚀 ~ input.on ~ multiplier:', multiplier[0]);
    allMultipliers.push(multiplier[0])
  }
})


input.on('close', () => {
  inputStream.close();

  const sum = allMultipliers.reduce((acc, multiplierString) => {
    const numStrings = multiplierString.matchAll(/\d{1,3}/g);

    let res = 1;

    for (const numString of numStrings) {
      res = parseInt(numString[0], 10) * res;
    }

    return acc + res;
  }, 0)

  const outputStream = createWriteStream(path.join(import.meta.dirname, './output.txt'));
  outputStream.write(sum.toString(), (error) => {
    if (error) {
      console.log(error);
    }

    outputStream.close();
  })
})

