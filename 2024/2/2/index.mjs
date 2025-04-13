import readline from 'node:readline';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';


const inputStream = createReadStream(path.join(import.meta.dirname, './input.txt'));

const input = readline.createInterface({ input: inputStream })

let successReportsCount = 0;

input.on('line', (line) => {
  const reportLevels = line.trim().split(/\s+/).map(Number)

  const checkReports = (reports) => {
    const direction = reports[0] > reports[1] ? -1 : 1;
    for (let i = 1; i < reports.length; i++) {
      const diff = (reports[i] - reports[i - 1]) * direction;
      if (diff < 1 || diff > 3) {
        return false;
      }
    }

    return true;
  }

  const isValidReports = checkReports(reportLevels);

  if (isValidReports) {
    successReportsCount += 1;
    return;
  }

  for (let i = 0; i < reportLevels.length; i++) {
    const reportsCopy = reportLevels.slice();

    reportsCopy.splice(i, 1);

    const isValidReports = checkReports(reportsCopy);

    if (isValidReports) {
      successReportsCount += 1;
      return;
    }
  }

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

