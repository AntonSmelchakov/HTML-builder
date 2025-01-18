const path = require('node:path');
const { mkdir, readdir, rm, copyFile } = require('node:fs/promises');

async function copyDir() {
  let oldDirPath = path.join(__dirname, 'files');
  let newDirPath = path.join(__dirname, 'files-copy');
  mkdir(newDirPath, { recursive: true });
  let oldDirInfo = await readdir(oldDirPath);
  let newDirInfo = await readdir(newDirPath);
  for (const fileName of newDirInfo) {
    if (!oldDirInfo.includes(fileName)) {
      let p = path.join(newDirPath, fileName);
      await rm(p);
    }
  }
  for (const fileName of oldDirInfo) {
    let oldP = path.join(oldDirPath, fileName);
    let newP = path.join(newDirPath, fileName);
    await copyFile(oldP, newP);
  }
}

copyDir();
