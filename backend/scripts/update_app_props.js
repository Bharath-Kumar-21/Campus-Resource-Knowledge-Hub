const fs = require('fs');

const p = 'D:/CRKH/backend/src/main/resources/application.properties';
let code = fs.readFileSync(p, 'utf8');

if (!code.includes('file:D:/CRKH/frontend/templates_src/')) {
  code = code.replace(
    '# Thymeleaf\nspring.thymeleaf.cache=false',
    '# Thymeleaf\nspring.thymeleaf.prefix=file:D:/CRKH/frontend/templates_src/\nspring.thymeleaf.cache=false'
  );
  fs.writeFileSync(p, code, 'utf8');
  console.log('application.properties updated with frontend templates path');
} else {
  console.log('application.properties already contains frontend templates path');
}
