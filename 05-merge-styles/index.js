const path = require('path');
const process = require('process');
const fs = require('fs');
const {
  readdir
} = require('fs/promises');

const originStylePath = path.join(__dirname, 'styles');
const bundleStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

(async () => {
  const stylesFolderContent= await readdir(originStylePath, {
    withFileTypes: true
  });
  
  const styleFiles = [];
  stylesFolderContent.forEach(elem => {
    if (path.extname(path.join(originStylePath, elem.name)) == '.css' && elem.isFile()){
      styleFiles.push(elem);
    }
  })

  styleFiles.forEach((elem, index) => {
    const stream = fs.createReadStream(path.join(originStylePath, elem.name));
    stream.on('data', chunk => {
      let styleStr = index == 0 ? chunk.toString() : '\n' + chunk.toString();
      bundleStream.write(styleStr);
    })
  })
  console.log(`style merging completed successfully`);
})();