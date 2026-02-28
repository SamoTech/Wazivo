// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables
process.env.GROQ_API_KEY = 'test-api-key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage with working getItem/setItem
const storage = new Map();
const localStorageMock = {
  getItem: jest.fn((key) => storage.get(key) || null),
  setItem: jest.fn((key, value) => storage.set(key, value)),
  removeItem: jest.fn((key) => storage.delete(key)),
  clear: jest.fn(() => storage.clear()),
};
global.localStorage = localStorageMock;

// Mock File API for browser file uploads
if (typeof File === 'undefined') {
  global.File = class File {
    constructor(bits, name, options = {}) {
      this.name = name;
      this.size = bits.reduce((acc, bit) => acc + (bit.byteLength || bit.length || 0), 0);
      this.type = options.type || '';
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

// Mock ArrayBuffer if needed
if (typeof ArrayBuffer === 'undefined') {
  global.ArrayBuffer = class ArrayBuffer {
    constructor(length) {
      this.byteLength = length;
    }
  };
}
