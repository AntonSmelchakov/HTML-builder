const path = require('node:path');
const { open } = require('node:fs/promises');
const { stdout, stdin } = process;
let realPath = path.join(__dirname, 'text.txt');
process.on('exit', () => stdout.write('\nBye!\n'));
process.on('SIGINT', () => {
  process.exit();
});

async function writeFile(sourceData, targetStream) {
  for await (const chunk of sourceData) {
    console.log(sourceData, chunk);
    targetStream.write(chunk);
  }
}

async function main() {
  const file = await open(realPath, 'a');
  const stream = file.createWriteStream();
  stdout.write('Hi, enter your text and press "Enter"\n');
  stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') process.exit();
    stream.write(data);
  });
}

main();
