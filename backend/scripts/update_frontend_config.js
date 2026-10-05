const fs = require('fs');

const p = 'D:/CRKH/backend/src/main/java/app/config/WebMvcConfig.java';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
  '"classpath:/static/css/"',
  '"file:D:/CRKH/frontend/css/", "classpath:/static/css/"'
);
code = code.replace(
  '"classpath:/static/js/"',
  '"file:D:/CRKH/frontend/js/", "classpath:/static/js/"'
);
code = code.replace(
  '"classpath:/static/images/"',
  '"file:D:/CRKH/frontend/images/", "classpath:/static/images/"'
);

fs.writeFileSync(p, code, 'utf8');
console.log('Successfully added D:/CRKH/frontend paths to WebMvcConfig.java');
