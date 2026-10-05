const fs = require('fs');
const p = 'D:/CRKH/backend/src/main/java/app/service/ResourceService.java';
let code = fs.readFileSync(p, 'utf8');

const targetStr = 'case OTHER -> "/images/products/arduino_kit.jpg";';
const replaceStr = 'case OTHER -> "/images/products/arduino_kit.jpg";\n            default -> "/images/products/arduino_kit.jpg";';

code = code.replace(targetStr, replaceStr);
fs.writeFileSync(p, code, 'utf8');
console.log('Successfully added default case to ResourceService.java!');
