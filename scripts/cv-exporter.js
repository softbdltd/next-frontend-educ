const fs = require('fs');
const path = require('path');

const cvRoot = './public/images/cv';
const cvRegx = /\.cv\.svg$/;

const files = fs.readdirSync(cvRoot).filter((name) => cvRegx.test(name));

files.forEach((file) => {
  const fileData = fs.readFileSync(path.join(cvRoot, file));
  const newData =
    'const svg = `' + fileData.toString() + '`;\nexport default svg;';
  const newFile = file.replace(cvRegx, '.js');
  fs.writeFileSync(path.join(cvRoot, newFile), newData);
  console.log('Export Successful: ', file, '>', newFile);
});
