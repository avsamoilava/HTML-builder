const path = require('path');
const {
  copyFile,
  mkdir,
  unlink
} = require('fs');
const {
  readdir
} = require('fs/promises');


function copyDir() {
  const filesPath = path.join(__dirname, 'files');
  const copyFilesPath = path.join(__dirname, 'files-copy');

  mkdir(path.join(copyFilesPath), {
    recursive: true
  }, (err) => {
    if (err) console.log(err)
  });

  (async () => {
    const copyDirFiles = await readdir(copyFilesPath);
    copyDirFiles.forEach(file => {
      unlink(path.join(copyFilesPath, file), err => {
        if (err) throw err;
      });
    })
    
    const startDirContent = await readdir(filesPath);
    startDirContent.forEach(file => {
      const origin = path.join(filesPath, file);
      const copy = path.join(copyFilesPath, file);
      copyFile(origin, copy, (err) => {
        if (err) throw err;
      })
    })
  })()
}

copyDir();