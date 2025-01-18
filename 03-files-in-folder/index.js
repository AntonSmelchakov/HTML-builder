const { stdout, stdin } = process;
const path = require('node:path');
const { readdir, stat } = require('node:fs/promises');
let realPath = path.join(__dirname, 'secret-folder');

async function whatFilesThere(p) {
  try {
    const fileList = await readdir(p, { withFileTypes: true });
    for (const file of fileList) {
      if (file.isFile()) makeLog(file);
    }
  } catch (err) {
    console.log(err);
  }
}

async function makeLog(fileinfo) {
  let fileName = fileinfo.name;
  let fileExt = path.extname(fileName).slice(1);
  let filePath = path.join(fileinfo.path, fileName);
  let fileStat = await stat(filePath);
  let fileNameSimp = path.basename(filePath, fileExt).slice(0, -1);
  let fileInfoResult = `${fileNameSimp} - ${fileExt} - ${fileStat.size}b\n`;
  stdout.write(fileInfoResult);
}

whatFilesThere(realPath);
