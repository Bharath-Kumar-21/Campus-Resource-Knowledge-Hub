const http = require('http');
const fs = require('fs');

function postLogin(cb) {
  const postData = 'username=' + encodeURIComponent('student1@college.edu') + '&password=' + encodeURIComponent('Student@123');
  const req = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/perform_login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, res => {
    const cookies = res.headers['set-cookie'];
    const sessionCookie = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';
    cb(sessionCookie);
  });
  req.write(postData);
  req.end();
}

postLogin(cookie => {
  console.log('Logged in successfully. Preparing multipart upload...');
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

  // Read a sample image to upload
  const sampleImage = fs.readFileSync('D:/CRKH/backend/src/main/resources/static/images/products/casio_calculator.jpg');

  function addField(name, val) {
    return '--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"\r\n\r\n' + val + '\r\n';
  }

  let head = addField('title', 'Logitech C920 HD Pro Webcam') +
             addField('category', 'OTHER') +
             addField('itemCondition', 'Like New') +
             addField('sharingType', 'ITEM_EXCHANGE') +
             addField('exchangePreference', 'Looking to swap for USB condenser mic or ring light') +
             addField('satisfactionTerms', 'Test video stream on laptop pickup before QR scan') +
             addField('location', 'Media Lab Room 4B') +
             addField('availabilityFrom', '2026-10-06') +
             addField('availabilityTo', '2026-11-06') +
             addField('description', 'Full HD 1080p stream webcam with dual stereo mics.') +
             '--' + boundary + '\r\nContent-Disposition: form-data; name="imageFile"; filename="webcam_test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n';

  let tail = '\r\n--' + boundary + '--\r\n';

  const fullPayload = Buffer.concat([
    Buffer.from(head, 'utf8'),
    sampleImage,
    Buffer.from(tail, 'utf8')
  ]);

  const req = http.request({
    hostname: 'localhost',
    port: 8080,
    path: '/resources/new',
    method: 'POST',
    headers: {
      'Cookie': cookie,
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': fullPayload.length
    }
  }, res => {
    console.log('UPLOAD POST STATUS:', res.statusCode);
    console.log('REDIRECT LOCATION:', res.headers['location']);

    // Check newly uploaded file
    checkLatestUpload();
  });

  req.write(fullPayload);
  req.end();
});

function checkLatestUpload() {
  setTimeout(() => {
    const dir = 'D:/CRKH/backend/uploads/products';
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      console.log('Files in uploads/products/:', files);
      if (files.length > 0) {
        const latest = files[files.length - 1];
        http.get('http://localhost:8080/uploads/products/' + latest, res => {
          console.log('Serving /uploads/products/' + latest + ' => HTTP Status: ' + res.statusCode);
        });
      }
    }
  }, 1000);
}
