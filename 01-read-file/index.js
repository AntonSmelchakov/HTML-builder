const path = require('node:path');
const { open } = require('node:fs/promises');
const { stdout, stdin } = process;

async function readChunks(streamVar) {
  for await (const chunk of streamVar) {
    stdout.write(chunk);
  }
}

async function readFile() {
  let realPath = path.join(__dirname, 'text.txt');
  const file = await open(realPath);
  const stream = file.createReadStream();
  readChunks(stream);
}

readFile();
