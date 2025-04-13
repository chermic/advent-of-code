import readline from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';


const inputStream = createReadStream(path.join(import.meta.dirname, './input.txt'));

const input = readline.createInterface({ input: inputStream })

let successReportsCount = 0;

input.on('line', (line) => {
  const reportLevels = line.trim().split(/\s+/).map(Number)

  const direction = reportLevels[0] > reportLevels[1] ? -1 : 1;
  for (let i = 1; i < reportLevels.length; i++) {
    const diff = (reportLevels[i] - reportLevels[i - 1]) * direction;
    if (diff < 1 || diff > 3) {
      return;
    }
  }

  successReportsCount += 1;
})


input.on('close', () => {
  inputStream.close();

  const outputStream = createWriteStream(path.join(import.meta.dirname, './output.txt'));
  outputStream.write(successReportsCount.toString(), (error) => {
    if (error) {
      console.log(error);
    }

    outputStream.close();
  })
})

