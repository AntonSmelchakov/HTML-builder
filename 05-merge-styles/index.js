const path = require('node:path');
const { readdir, open, writeFile, rm } = require('node:fs/promises');

async function writeData(targetFile, fileInfo) {
  let sourcePath = path.join(fileInfo.path, fileInfo.name);
  let sourceFH = await open(sourcePath);
  let sourceStream = sourceFH.createReadStream();
  console.log(targetFile);
  for await (const chunk of sourceStream) {
    targetFile.appendFile(chunk);
  }
}

async function mergeStyles() {
  let targetFile = path.join(__dirname, 'project-dist', 'bundle.css');
  await rm(targetFile, { force: true });
  await writeFile(targetFile, '');
  const targetFH = await open(targetFile, 'a');

  let stylesDir = path.join(__dirname, 'styles');

  const fileList = await readdir(stylesDir, { withFileTypes: true });
  for (const fileInfo of fileList) {
    if (path.extname(fileInfo.name) === '.css') {
      await writeData(targetFH, fileInfo);
    }
  }
}

mergeStyles();
