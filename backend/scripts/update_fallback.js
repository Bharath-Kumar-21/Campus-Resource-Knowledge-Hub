const fs = require('fs');

const jsPath = 'D:/CRKH/backend/src/main/resources/static/js/main.js';
const jsTarget = 'D:/CRKH/backend/target/classes/static/js/main.js';

let js = fs.readFileSync(jsPath, 'utf8');

const newMap = `const CATEGORY_FALLBACK_IMAGES = {
  'TEXTBOOK': '/images/products/dbms_book.jpg',
  'CALCULATOR': '/images/products/casio_calculator.jpg',
  'HDMI_CABLE': '/images/products/hdmi_cable.jpg',
  'ADAPTER': '/images/products/usbc_adapter.jpg',
  'LAB_EQUIPMENT': '/images/products/breadboard_lab.jpg',
  'NOTES': '/images/products/network_notes.jpg',
  'STUDY_MATERIALS': '/images/products/java_book.jpg',
  'ELECTRONICS': '/images/products/sony_headphones.jpg',
  'SPORTS': '/images/products/basketball.jpg',
  'STATIONERY': '/images/products/network_notes.jpg',
  'HOSTEL_ITEMS': '/images/products/desk_lamp.jpg',
  'OTHER': '/images/products/arduino_kit.jpg'
};`;

js = js.replace(/const CATEGORY_FALLBACK_IMAGES = \{[\s\S]*?\};/, newMap);

fs.writeFileSync(jsPath, js, 'utf8');
if (fs.existsSync(jsTarget)) {
  fs.writeFileSync(jsTarget, js, 'utf8');
}

console.log('Successfully updated main.js fallback images to studio photography!');
