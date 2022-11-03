const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');

const dirPath = path.join(__dirname, 'secret-folder');

(async () => {
  const dirContent = await readdir(dirPath, {
    withFileTypes: true
  });
  const files = dirContent.filter(elem => elem.isFile());
  for (const file of files) {
    let extension = path.extname(file.name);
    let name = file.name.split(`${extension}`).join('');
    stat(path.join(dirPath, file.name), (err, stats) => {
      console.log(`${name} - ${extension.slice(1)} - ${stats.size*0.000977}kb`)
    });;
  }
})();