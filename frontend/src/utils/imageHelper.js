/**
 * Centralized Resource Image Resolver & Fallback Handler
 */

export function getResourceImageUrl(resource) {
  if (!resource) return '/images/products/default.svg';

  const rawUrl = typeof resource === 'string' ? resource : resource.imageUrl;
  const title = (resource.title || '').toLowerCase();
  const category = resource.category || '';

  // Keyword-based matching for known items takes precedence
  if (title.includes('webcam') || title.includes('camera') || title.includes('c920')) {
    return '/images/products/webcam.jpg';
  }

  // If a valid custom URL is provided
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim()) {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    if (trimmed.startsWith('/images/products/')) return trimmed;
    if (trimmed.startsWith('/uploads/products/')) return trimmed;
    if (trimmed.startsWith('/images/')) return `/images/products/${trimmed.replace('/images/', '')}`;
    if (trimmed.startsWith('images/products/')) return `/${trimmed}`;
  }
  if (title.includes('casio')) return '/images/products/casio_calculator.jpg';
  if (title.includes('ti-84') || title.includes('graphing')) return '/images/products/ti84_calculator.jpg';
  if (title.includes('calc')) return '/images/products/casio_calculator.jpg';
  if (title.includes('dbms') || title.includes('database')) return '/images/products/dbms_book.jpg';
  if (title.includes('java') || title.includes('programming')) return '/images/products/java_book.jpg';
  if (title.includes('hdmi') || title.includes('cable')) return '/images/products/hdmi_cable.jpg';
  if (title.includes('adapter') || title.includes('usb-c') || title.includes('hub')) return '/images/products/usbc_adapter.jpg';
  if (title.includes('breadboard') || title.includes('oscilloscope')) return '/images/products/breadboard_lab.jpg';
  if (title.includes('note') || title.includes('network')) return '/images/products/network_notes.jpg';
  if (title.includes('arduino')) return '/images/products/arduino_kit.jpg';
  if (title.includes('headphone') || title.includes('sony')) return '/images/products/sony_headphones.jpg';
  if (title.includes('basketball') || title.includes('ball') || title.includes('sport')) return '/images/products/basketball.jpg';
  if (title.includes('lamp') || title.includes('light') || title.includes('desk')) return '/images/products/desk_lamp.jpg';

  // Category fallback
  switch (category) {
    case 'TEXTBOOK': return '/images/products/dbms_book.jpg';
    case 'CALCULATOR': return '/images/products/casio_calculator.jpg';
    case 'ADAPTER': return '/images/products/usbc_adapter.jpg';
    case 'HDMI_CABLE': return '/images/products/hdmi_cable.jpg';
    case 'LAB_EQUIPMENT': return '/images/products/arduino_kit.jpg';
    case 'NOTES': return '/images/products/network_notes.jpg';
    case 'STUDY_MATERIALS': return '/images/products/java_book.jpg';
    case 'ELECTRONICS': return '/images/products/sony_headphones.jpg';
    case 'SPORTS': return '/images/products/basketball.jpg';
    case 'HOSTEL_ITEMS': return '/images/products/desk_lamp.jpg';
    default: return '/images/products/default.svg';
  }
}

export function handleImageError(e, resource) {
  e.currentTarget.onerror = null;
  const fallback = getResourceImageUrl({
    title: resource?.title,
    category: resource?.category,
    imageUrl: null
  });

  if (e.currentTarget.src.indexOf(fallback) === -1) {
    e.currentTarget.src = fallback;
  } else {
    e.currentTarget.src = '/images/products/default.svg';
  }
}
