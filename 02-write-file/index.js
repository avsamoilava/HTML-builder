const process = require('process');
const path = require('path');
const fs = require('fs');

const outputStream = fs.createWriteStream(path.join(__dirname, 'output.txt'));

process.stdout.write('Напишите что-нибудь и введите "enter":\n');

process.stdin.on('data', data => {
  if(data.toString().slice(0,-2) === 'exit') {
    process.exit();
  } else {
    outputStream.write(data);
  }
})

process.on('SIGINT', ()=>{
  process.exit();
});

process.on('exit', ()=>process.stdout.write('Пока-пока!'));