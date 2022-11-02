const process = require('process');
const path = require('path');
const fs = require('fs');

const txtPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(txtPath);

stream.on('data', chunk=>{
  process.stdout.write(chunk);
})