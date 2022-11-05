const path = require('path');
const fs = require('fs');
const {
  readdir
} = require('fs/promises');

(function createDistFolder() {
  fs.mkdir(path.join(__dirname, 'project-dist'), {
    recursive: true
  }, (err) => {
    if (err) console.log(err);
  });
})();


(function createHTML() {
  const initialHTMLPath = path.join(__dirname, 'template.html');
  const destHTMLPath = path.join(__dirname, 'project-dist', 'index.html');
  const readHTML = fs.createReadStream(initialHTMLPath);
  const writeHTML = fs.createWriteStream(destHTMLPath);
  const componentsFolder = path.join(__dirname, 'components');
  let htmlStr = '';

  readHTML.on('data', chunk => {
    htmlStr = chunk.toString();

    (async () => {
      let allFiles = await readdir(componentsFolder, {
        withFileTypes: true
      });

      let files = [];
      allFiles.forEach(elem => {
        if (elem.isFile() && path.extname(path.join(componentsFolder, elem.name)) === '.html') {
          files.push(elem)
        }
      });

      for (const file of files) {
        let tempName = `{{${file.name.replace('.html', '')}}}`;
        const compPath = path.join(componentsFolder, file.name);
        const readComp = fs.createReadStream(compPath);
        await new Promise((resolve, reject) => {
            readComp.on('data', chunk => {
              htmlStr = htmlStr.replace(tempName, chunk.toString());
              resolve(htmlStr);
              reject('ooops!');
            })
          })
          .catch(err => console.log(err))
      };
      writeHTML.write(htmlStr);
    })();
  })
})();


(function mergeStyles() {
  const originStylePath = path.join(__dirname, 'styles');
  const bundleStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

  (async () => {
    const stylesFolderContent = await readdir(originStylePath, {
      withFileTypes: true
    });

    const styleFiles = [];
    stylesFolderContent.forEach(elem => {
      if (path.extname(path.join(originStylePath, elem.name)) == '.css' && elem.isFile()) {
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
  })();
})();


(function copyAssets() {
  const initAssets = path.join(__dirname, 'assets');
  const destAssets = path.join(__dirname, 'project-dist', 'assets');

  fs.mkdir(path.join(destAssets), {
    recursive: true
  }, (err) => {
    if (err) console.log(err)
  });

  async function cleanFolder(folder) {
    const copyDirFiles = await readdir(folder, {
      withFileTypes: true
    });

    copyDirFiles.forEach(file => {
      if (file.isDirectory()) {
        cleanFolder(path.join(folder, file.name))
      } else {
        fs.unlink(path.join(folder, file.name), err => {
          if (err) throw err;
        });
      }
    })
  };
  cleanFolder(destAssets);

  async function copyDir(init, dest) {
    const startDirContent = await readdir(init, {
      withFileTypes: true
    });

    startDirContent.forEach(async (item) => {
      const origin = path.join(init, item.name);
      const copy = path.join(dest, item.name);
      if (item.isDirectory()) {

        copyDir(origin, copy);
      } else {
        fs.mkdir(dest, {
          recursive: true
        }, (err) => {
          if (err) throw err
        });
        fs.copyFile(origin, copy, (err) => {
          if (err) throw err;
        })
      }
    })
  }
  copyDir(initAssets, destAssets);
})();