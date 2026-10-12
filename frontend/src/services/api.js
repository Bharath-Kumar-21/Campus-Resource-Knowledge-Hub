// CRKH API Client & Demo Fallback Store
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const SEED_RESOURCES = [
  {
    id: 1,
    title: 'DBMS Textbook - Navathe & Elmasri (7th Ed)',
    ownerName: 'Bharath Kumar',
    ownerId: 1,
    ownerReputation: 105,
    category: 'TEXTBOOK',
    sharingMode: 'Item Exchange',
    availableFrom: '2026-10-05',
    availableUntil: '2026-11-19',
    pickupLocation: 'Central Campus Library, 2nd Floor',
    condition: 'EXCELLENT',
    description: 'Comprehensive Database Systems textbook for CS 301. Clean pages with minimal pencil highlights. Looking to exchange for Computer Graphics or Distributed Systems.',
    imageUrl: '/images/products/dbms_book.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 2,
    title: 'Casio fx-991EX ClassWiz Scientific Calculator',
    ownerName: 'Aarav Patel',
    ownerId: 2,
    ownerReputation: 110,
    category: 'CALCULATOR',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-06',
    availableUntil: '2026-10-20',
    pickupLocation: 'Tech Park Block C, Room 304',
    condition: 'LIKE_NEW',
    description: 'High-speed natural textbook display calculator. Solar + battery dual power. Perfect for midterms and engineering exams.',
    imageUrl: '/images/products/casio_calculator.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 3,
    title: 'High-Speed 4K HDMI Cable (2m Braided)',
    ownerName: 'Ananya Sharma',
    ownerId: 3,
    ownerReputation: 95,
    category: 'HDMI_CABLE',
    sharingMode: 'Skill Swap',
    availableFrom: '2026-10-03',
    availableUntil: '2026-10-10',
    pickupLocation: 'Hostel Block A Common Room',
    condition: 'EXCELLENT',
    description: 'Heavy-duty braided HDMI 2.1 cable supporting 4K @ 120Hz. Ideal for project presentations in seminar halls.',
    imageUrl: '/images/products/hdmi_cable.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 4,
    title: 'Anker USB-C 7-in-1 Dual Display Hub',
    ownerName: 'Rohan Verma',
    ownerId: 4,
    ownerReputation: 100,
    category: 'ADAPTER',
    sharingMode: 'Security Pledge',
    availableFrom: '2026-10-05',
    availableUntil: '2026-10-25',
    pickupLocation: 'Student Activity Center / Cafeteria',
    condition: 'LIKE_NEW',
    description: 'Provides 4K HDMI, 100W Power Delivery, SD/TF Card slots, and dual USB 3.0 ports. Requires 200 pts pledge.',
    imageUrl: '/images/products/usbc_adapter.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 5,
    title: 'Arduino Uno R3 Starter Kit with Sensors',
    ownerName: 'Pooja Nair',
    ownerId: 5,
    ownerReputation: 105,
    category: 'LAB_EQUIPMENT',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-07',
    availableUntil: '2026-10-28',
    pickupLocation: 'Computer Science Block B, Lab 102',
    condition: 'GOOD',
    description: 'Complete kit including Arduino board, ultrasonic sensor, RFID, servo motor, and resistor bundle for IoT mini-projects.',
    imageUrl: '/images/products/arduino_kit.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 6,
    title: 'Computer Networks Handwritten Class Notes (Sem 5)',
    ownerName: 'Vikram Singh',
    ownerId: 6,
    ownerReputation: 100,
    category: 'NOTES',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-04',
    availableUntil: '2026-10-25',
    pickupLocation: 'Central Campus Library',
    condition: 'EXCELLENT',
    description: 'Color-coded notes covering OSI model, TCP/IP, subnetting algorithms, BGP routing, and socket programming diagrams.',
    imageUrl: '/images/products/network_notes.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 7,
    title: 'Operating Systems Concepts - Silberschatz (10th Ed)',
    ownerName: 'Sneha Reddy',
    ownerId: 7,
    ownerReputation: 115,
    category: 'STUDY_MATERIALS',
    sharingMode: 'Item Exchange',
    availableFrom: '2026-10-05',
    availableUntil: '2026-11-15',
    pickupLocation: 'Library Silent Study Zone 3F',
    condition: 'LIKE_NEW',
    description: 'The definitive Dinosaur book. Explains semaphores, paging, virtual memory, and Unix thread scheduling.',
    imageUrl: '/images/products/java_book.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 8,
    title: 'Sony WH-1000XM4 Noise-Cancelling Headphones',
    ownerName: 'Karthik Rao',
    ownerId: 8,
    ownerReputation: 100,
    category: 'ELECTRONICS',
    sharingMode: 'Security Pledge',
    availableFrom: '2026-10-08',
    availableUntil: '2026-10-18',
    pickupLocation: 'Media Lab Room 4B',
    condition: 'EXCELLENT',
    description: 'Industry-leading ANC headphones for high-focus exam weeks or audio editing projects. 30hr battery.',
    imageUrl: '/images/products/sony_headphones.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 9,
    title: 'Official Spalding TF-1000 Indoor Basketball',
    ownerName: 'Dev Mehra',
    ownerId: 9,
    ownerReputation: 100,
    category: 'SPORTS',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-05',
    availableUntil: '2026-10-20',
    pickupLocation: 'Campus Recreation Center Locker 14',
    condition: 'GOOD',
    description: 'Competition microfiber composite basketball. Official size 7. Available for weekend inter-hostel tournaments.',
    imageUrl: '/images/products/basketball.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 10,
    title: 'Rotring Rapid Pro Engineering Drafting Pen Set',
    ownerName: 'Meera Iyer',
    ownerId: 10,
    ownerReputation: 105,
    category: 'STATIONERY',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-06',
    availableUntil: '2026-10-27',
    pickupLocation: 'Architecture Studio 2A',
    condition: 'EXCELLENT',
    description: 'Set of technical drawing fineliners (0.25mm, 0.35mm, 0.50mm) plus compass adapter for civil/mechanical sheets.',
    imageUrl: '/images/products/network_notes.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 11,
    title: 'Philips EyeCare LED Desk Study Lamp',
    ownerName: 'Tanvi Joshi',
    ownerId: 11,
    ownerReputation: 100,
    category: 'HOSTEL_ITEMS',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-05',
    availableUntil: '2026-10-25',
    pickupLocation: 'Hostel Block C, Room 312',
    condition: 'EXCELLENT',
    description: 'Dimmable color temperature LED lamp with USB charging pass-through. Flicker-free for late-night study sessions.',
    imageUrl: '/images/products/desk_lamp.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 12,
    title: 'Raspberry Pi 4 Model B (4GB) with Case & Fan',
    ownerName: 'Aditya Gupta',
    ownerId: 12,
    ownerReputation: 120,
    category: 'LAB_EQUIPMENT',
    sharingMode: 'Security Pledge',
    availableFrom: '2026-10-08',
    availableUntil: '2026-11-01',
    pickupLocation: 'Makerspace Lab B4',
    condition: 'EXCELLENT',
    description: 'Includes 32GB SanDisk MicroSD preloaded with Raspberry Pi OS, official power supply, and Micro-HDMI to HDMI cable.',
    imageUrl: '/images/products/breadboard_lab.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 13,
    title: 'Digital Multimeter with Probes & Thermocouple',
    ownerName: 'Sanjay Dutt',
    ownerId: 13,
    ownerReputation: 100,
    category: 'LAB_EQUIPMENT',
    sharingMode: 'Skill Swap',
    availableFrom: '2026-10-07',
    availableUntil: '2026-10-21',
    pickupLocation: 'Electronics Lab 2, Main Building',
    condition: 'GOOD',
    description: 'Auto-ranging digital multimeter with continuity buzzer, capacitance, and diode test modes.',
    imageUrl: '/images/products/breadboard_lab.jpg',
    status: 'AVAILABLE'
  },
  {
    id: 14,
    title: 'MacBook MagSafe 3 Fast Charging Cable (2m)',
    ownerName: 'Nisha Pillai',
    ownerId: 14,
    ownerReputation: 105,
    category: 'ADAPTER',
    sharingMode: 'Free Borrow',
    availableFrom: '2026-10-05',
    availableUntil: '2026-10-25',
    pickupLocation: 'Innovation Hub Lounge',
    condition: 'LIKE_NEW',
    description: 'Original Apple space gray woven MagSafe 3 cable. Pairs with USB-C power adapters for 140W fast charging.',
    imageUrl: '/images/products/usbc_adapter.jpg',
    status: 'AVAILABLE'
  }
];

export const SEED_BORROWINGS = [
  {
    id: 1,
    resourceId: 1,
    resourceTitle: 'DBMS Textbook - Navathe & Elmasri (7th Ed)',
    borrowerName: 'Aarav Patel',
    borrowerId: 2,
    ownerName: 'Bharath Kumar',
    ownerId: 1,
    startDate: '2026-10-10',
    dueDate: '2026-10-25',
    status: 'APPROVED',
    handoverToken: 'CRK-84A1',
    category: 'TEXTBOOK',
    notes: 'Need for DB midterm preparation.'
  },
  {
    id: 2,
    resourceId: 2,
    resourceTitle: 'Casio fx-991EX ClassWiz Scientific Calculator',
    borrowerName: 'Bharath Kumar',
    borrowerId: 1,
    ownerName: 'Aarav Patel',
    ownerId: 2,
    startDate: '2026-10-06',
    dueDate: '2026-10-20',
    status: 'ACTIVE',
    handoverToken: 'CRK-99EX',
    category: 'CALCULATOR',
    notes: 'Engineering Mathematics 3 semester finals.'
  },
  {
    id: 3,
    resourceId: 5,
    resourceTitle: 'Arduino Uno R3 Starter Kit with Sensors',
    borrowerName: 'Ananya Sharma',
    borrowerId: 3,
    ownerName: 'Bharath Kumar',
    ownerId: 1,
    startDate: '2026-10-12',
    dueDate: '2026-10-22',
    status: 'PENDING',
    handoverToken: null,
    category: 'LAB_EQUIPMENT',
    notes: 'Embedded Systems lab submission.'
  }
];

export const SEED_REQUESTS = [
  {
    id: 1,
    title: 'Casio or Sharp Graphing Calculator for Calculus III',
    requesterName: 'Sneha Reddy',
    requesterId: 7,
    category: 'CALCULATOR',
    description: 'Looking to borrow a matrix/graphing scientific calculator for upcoming multivariable calculus midterm.',
    neededBy: '2026-10-16',
    location: 'Tech Park Block B',
    status: 'OPEN',
    createdAt: '2026-10-10'
  },
  {
    id: 2,
    title: 'Arduino / ESP32 WiFi Development Board',
    requesterName: 'Vikram Singh',
    requesterId: 6,
    category: 'LAB_EQUIPMENT',
    description: 'Need for IoT Smart Campus hackathon project this weekend. Can exchange Raspberry Pi camera.',
    neededBy: '2026-10-14',
    location: 'Computer Science Lab 102',
    status: 'OPEN',
    createdAt: '2026-10-09'
  },
  {
    id: 3,
    title: 'Braided HDMI to USB-C Cable for Auditorium Projector',
    requesterName: 'Rohan Verma',
    requesterId: 4,
    category: 'HDMI_CABLE',
    description: 'Presenting research paper in Main Auditorium; need a reliable low-latency display cable.',
    neededBy: '2026-10-15',
    location: 'Auditorium Green Room',
    status: 'OPEN',
    createdAt: '2026-10-11'
  }
];

export const SEED_DOCUMENTS = [
  {
    id: 1,
    title: 'DBMS Semester 5 Complete Question Bank & Solutions.pdf',
    tags: 'dbms, exam, cse, sql',
    fileSize: '4.2 MB',
    contentType: 'application/pdf',
    uploadDate: '2026-10-08',
    ownerId: 1
  },
  {
    id: 2,
    title: 'Computer Networks Lab Viva Cheat Sheet.docx',
    tags: 'networks, lab, cheat-sheet, tcp-ip',
    fileSize: '1.8 MB',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadDate: '2026-10-09',
    ownerId: 1
  },
  {
    id: 3,
    title: 'Compiler Design Handcrafted State Diagrams.pdf',
    tags: 'compiler, automata, parsing, lex-yacc',
    fileSize: '3.1 MB',
    contentType: 'application/pdf',
    uploadDate: '2026-10-11',
    ownerId: 1
  }
];

export const SEED_USERS = [
  { id: 1, name: 'Bharath Kumar', email: 'student1@college.edu', role: 'STUDENT', status: 'ACTIVE', department: 'Computer Science & Engineering', year: '3rd Year', reputation: 105 },
  { id: 2, name: 'Aarav Patel', email: 'student2@college.edu', role: 'STUDENT', status: 'ACTIVE', department: 'Electrical & Electronics', year: '3rd Year', reputation: 110 },
  { id: 3, name: 'Campus Admin', email: 'admin@college.edu', role: 'ADMIN', status: 'ACTIVE', department: 'Academic Administration', year: 'Staff', reputation: 150 }
];

// Helper for HTTP requests
function getAuthHeaders() {
  const token = localStorage.getItem('CRKH_AUTH_TOKEN');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Local storage backup stores
function getStored(key, defaultValue) {
  try {
    const raw = localStorage.getItem('CRKH_STORE_' + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem('CRKH_STORE_' + key, JSON.stringify(value));
  } catch (e) {}
}

export const api = {
  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.warn('Backend login unavailable, using simulated auth');
    }
    // Fallback simulation
    const matchedUser = SEED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: Date.now(),
      name: email.split('@')[0],
      email: email,
      role: email.includes('admin') ? 'ADMIN' : 'STUDENT',
      status: 'ACTIVE',
      department: 'Engineering',
      year: '2nd Year',
      reputation: 100
    };
    return {
      token: 'crkh-mock-jwt-' + Date.now(),
      user: matchedUser
    };
  },

  async register(data) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.warn('Backend register unavailable, using simulated auth');
    }
    const newUser = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      role: 'STUDENT',
      status: 'ACTIVE',
      department: data.department || 'Computer Science',
      year: data.year || '1st Year',
      reputation: 100
    };
    return {
      token: 'crkh-mock-jwt-' + Date.now(),
      user: newUser
    };
  },

  // Resources
  async getResources() {
    try {
      const res = await fetch(`${API_BASE}/resources`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {}
    return getStored('RESOURCES', SEED_RESOURCES);
  },

  async getResourceById(id) {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('RESOURCES', SEED_RESOURCES);
    return list.find(r => String(r.id) === String(id)) || null;
  },

  async createResource(resourceData) {
    try {
      const res = await fetch(`${API_BASE}/resources`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resourceData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('RESOURCES', SEED_RESOURCES);
    const newRes = {
      ...resourceData,
      id: Date.now(),
      status: 'AVAILABLE',
      imageUrl: resourceData.imageUrl || '/images/products/default.svg'
    };
    const updated = [newRes, ...list];
    setStored('RESOURCES', updated);
    return newRes;
  },

  // Borrowings
  async getBorrowings() {
    try {
      const res = await fetch(`${API_BASE}/borrowings`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return getStored('BORROWINGS', SEED_BORROWINGS);
  },

  async createBorrowing(borrowingData) {
    try {
      const res = await fetch(`${API_BASE}/borrowings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(borrowingData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('BORROWINGS', SEED_BORROWINGS);
    const newBorrowing = {
      ...borrowingData,
      id: Date.now(),
      status: 'PENDING',
      handoverToken: null
    };
    const updated = [newBorrowing, ...list];
    setStored('BORROWINGS', updated);
    return newBorrowing;
  },

  async approveBorrowing(id) {
    try {
      const res = await fetch(`${API_BASE}/borrowings/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('BORROWINGS', SEED_BORROWINGS);
    const updated = list.map(b => b.id === id ? { ...b, status: 'APPROVED', handoverToken: 'CRK-' + Math.random().toString(36).substring(2, 6).toUpperCase() } : b);
    setStored('BORROWINGS', updated);
    return updated.find(b => b.id === id);
  },

  async declineBorrowing(id) {
    try {
      const res = await fetch(`${API_BASE}/borrowings/${id}/decline`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('BORROWINGS', SEED_BORROWINGS);
    const updated = list.map(b => b.id === id ? { ...b, status: 'REJECTED' } : b);
    setStored('BORROWINGS', updated);
    return updated.find(b => b.id === id);
  },

  async returnBorrowing(id) {
    try {
      const res = await fetch(`${API_BASE}/borrowings/${id}/return`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('BORROWINGS', SEED_BORROWINGS);
    const updated = list.map(b => b.id === id ? { ...b, status: 'RETURNED' } : b);
    setStored('BORROWINGS', updated);
    return updated.find(b => b.id === id);
  },

  // Handover QR
  async generateHandoverQr(borrowingId, type = 'PICKUP') {
    try {
      const res = await fetch(`${API_BASE}/handovers/${borrowingId}/qr?type=${type}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    return {
      qrToken: 'CRK-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      borrowingId,
      type,
      expiresInMinutes: 30,
      createdAt: new Date().toISOString()
    };
  },

  async verifyHandoverToken(qrToken) {
    try {
      const res = await fetch(`${API_BASE}/handovers/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ qrToken })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    return {
      verified: true,
      reputationBoost: 5,
      token: qrToken,
      verifiedAt: new Date().toISOString()
    };
  },

  // Requests
  async getRequests() {
    try {
      const res = await fetch(`${API_BASE}/requests`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return getStored('REQUESTS', SEED_REQUESTS);
  },

  async createRequest(reqData) {
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reqData)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('REQUESTS', SEED_REQUESTS);
    const newReq = {
      ...reqData,
      id: Date.now(),
      status: 'OPEN',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newReq, ...list];
    setStored('REQUESTS', updated);
    return newReq;
  },

  // Documents (Knowledge Vault)
  async getDocuments() {
    try {
      const res = await fetch(`${API_BASE}/documents`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return getStored('DOCUMENTS', SEED_DOCUMENTS);
  },

  async uploadDocument(formData) {
    try {
      const res = await fetch(`${API_BASE}/documents`, {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('CRKH_AUTH_TOKEN') ? { 'Authorization': `Bearer ${localStorage.getItem('CRKH_AUTH_TOKEN')}` } : {})
        },
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const title = formData.get('title') || 'Uploaded Academic Document';
    const tags = formData.get('tags') || 'general';
    const list = getStored('DOCUMENTS', SEED_DOCUMENTS);
    const newDoc = {
      id: Date.now(),
      title,
      tags,
      fileSize: '2.4 MB',
      contentType: 'application/pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      ownerId: 1
    };
    const updated = [newDoc, ...list];
    setStored('DOCUMENTS', updated);
    return newDoc;
  },

  async deleteDocument(id) {
    try {
      const res = await fetch(`${API_BASE}/documents/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return true;
    } catch (e) {}
    const list = getStored('DOCUMENTS', SEED_DOCUMENTS);
    const updated = list.filter(d => d.id !== id);
    setStored('DOCUMENTS', updated);
    return true;
  },

  // Admin
  async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return getStored('ADMIN_USERS', SEED_USERS);
  },

  async updateAdminUserStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/status?status=${status}`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('ADMIN_USERS', SEED_USERS);
    const updated = list.map(u => u.id === id ? { ...u, status } : u);
    setStored('ADMIN_USERS', updated);
    return updated.find(u => u.id === id);
  },

  async updateAdminUserRole(id, role) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}/role?role=${role}`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {}
    const list = getStored('ADMIN_USERS', SEED_USERS);
    const updated = list.map(u => u.id === id ? { ...u, role } : u);
    setStored('ADMIN_USERS', updated);
    return updated.find(u => u.id === id);
  }
};
