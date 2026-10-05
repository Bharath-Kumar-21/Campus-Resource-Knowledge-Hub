const fs = require('fs');

const p = 'D:/CRKH/backend/src/main/java/app/config/DataInitializer.java';
let code = fs.readFileSync(p, 'utf8');

const oldMethod = code.substring(code.lastIndexOf('private void updateMissingResourceImages()'));

const newMethod = `private void updateMissingResourceImages() {
        resourceRepository.findAll().forEach(r -> {
            boolean updated = false;
            String t = r.getTitle().toLowerCase();
            String matchedImage = null;

            if (t.contains("casio")) {
                matchedImage = "/images/products/casio_calculator.jpg";
            } else if (t.contains("ti-84") || t.contains("graphing")) {
                matchedImage = "/images/products/ti84_calculator.jpg";
            } else if (t.contains("calc")) {
                matchedImage = "/images/products/casio_calculator.jpg";
            } else if (t.contains("dbms") || t.contains("database")) {
                matchedImage = "/images/products/dbms_book.jpg";
            } else if (t.contains("java") || t.contains("programming")) {
                matchedImage = "/images/products/java_book.jpg";
            } else if (t.contains("hdmi") || t.contains("cable")) {
                matchedImage = "/images/products/hdmi_cable.jpg";
            } else if (t.contains("adapter") || t.contains("usb-c") || t.contains("hub")) {
                matchedImage = "/images/products/usbc_adapter.jpg";
            } else if (t.contains("oscilloscope") || t.contains("breadboard")) {
                matchedImage = "/images/products/breadboard_lab.jpg";
            } else if (t.contains("notes") || t.contains("network")) {
                matchedImage = "/images/products/network_notes.jpg";
            } else if (t.contains("arduino")) {
                matchedImage = "/images/products/arduino_kit.jpg";
            } else if (t.contains("headphone") || t.contains("sony")) {
                matchedImage = "/images/products/sony_headphones.jpg";
            } else if (t.contains("basketball") || t.contains("wilson") || t.contains("sport")) {
                matchedImage = "/images/products/basketball.jpg";
            } else if (t.contains("lamp") || t.contains("light") || t.contains("desk")) {
                matchedImage = "/images/products/desk_lamp.jpg";
            }

            if (matchedImage != null && !matchedImage.equals(r.getImageUrl())) {
                r.setImageUrl(matchedImage);
                updated = true;
            }
            if (r.getItemCondition() == null) {
                r.setItemCondition("Like New");
                updated = true;
            }
            if (updated) {
                resourceRepository.save(r);
            }
        });
    }
}
`;

code = code.substring(0, code.lastIndexOf('private void updateMissingResourceImages()')) + newMethod;

fs.writeFileSync(p, code, 'utf8');
console.log('Successfully updated DataInitializer with exact local product image matching logic!');
