const path = require('node:path');
const {
  readdir,
  mkdir,
  copyFile,
  open,
  writeFile,
  rm,
  readFile,
} = require('node:fs/promises');

async function copyDir(oldDirPath, newDirPath) {
  mkdir(newDirPath, { recursive: true });
  let oldDirInfo = await readdir(oldDirPath);
  let newDirInfo = await readdir(newDirPath);
  for (const fileName of newDirInfo) {
    if (!oldDirInfo.includes(fileName)) {
      let p = path.join(newDirPath, fileName);
      await rm(p, { recursive: true, force: true });
    }
  }
  oldDirInfo = await readdir(oldDirPath, { withFileTypes: true });
  newDirInfo = await readdir(newDirPath, { withFileTypes: true });
  for (const fileInfo of oldDirInfo) {
    let fileName = fileInfo.name;
    if (fileInfo.isFile()) {
      let oldP = path.join(oldDirPath, fileName);
      let newP = path.join(newDirPath, fileName);
      await copyFile(oldP, newP);
    }
    if (fileInfo.isDirectory()) {
      let oldP = path.join(fileInfo.path, fileName);
      let newP = path.join(newDirPath, fileName);
      copyDir(oldP, newP);
    }
  }
}

async function writeData(targetFile, fileInfo) {
  let sourcePath = path.join(fileInfo.path, fileInfo.name);
  let sourceFH = await open(sourcePath);
  let sourceStream = sourceFH.createReadStream();
  for await (const chunk of sourceStream) {
    targetFile.appendFile(chunk);
  }
}

async function mergeStyles() {
  let targetFile = path.join(__dirname, 'project-dist', 'style.css');
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

async function buildHtml() {
  let templatePath = path.join(__dirname, 'template.html');
  let htmlData = await readFile(templatePath);
  let stringHtml = htmlData.toString();

  let compPath = path.join(__dirname, 'components');
  let compInfo = await readdir(compPath);
  let components = {};
  for await (const x of compInfo) {
    let oneCompPath = path.join(compPath, x);
    let compBuffer = await readFile(oneCompPath);
    let compName = path.basename(x, 'html').slice(0, -1);
    components[compName] = compBuffer.toString().trim();
  }
  let newStringHtml = stringHtml.replaceAll(/{{([a-z]+)}}/g, (match) => {
    let cN = match.slice(2, -2);
    return components[cN];
  });
  let newHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
  await rm(newHtmlPath, { force: true });
  await writeFile(newHtmlPath, newStringHtml);
}
async function buildPage() {
  let newDirPath = path.join(__dirname, 'project-dist');
  await mkdir(newDirPath, { recursive: true });
  /* Copy assets dir */
  let oldAssetsPath = path.join(__dirname, 'assets');
  let newAssetsPath = path.join(newDirPath, 'assets');
  copyDir(oldAssetsPath, newAssetsPath);
  /* Merge Styles */
  mergeStyles();
  /* construct html */
  buildHtml();
}

buildPage();
