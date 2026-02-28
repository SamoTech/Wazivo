// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock environment variables
process.env.GROQ_API_KEY = 'test-api-key';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
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

// Mock localStorage with Map-based storage
const createLocalStorageMock = () => {
  const store = new Map();
  return {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
};

global.localStorage = createLocalStorageMock();

// Mock File API for browser file uploads
class MockFile {
  constructor(bits, name, options = {}) {
    this.name = name;
    this.size = bits.reduce((acc, bit) => {
      if (bit instanceof ArrayBuffer) {
        return acc + bit.byteLength;
      }
      if (typeof bit === 'string') {
        return acc + bit.length;
      }
      return acc + (bit.length || 0);
    }, 0);
    this.type = options.type || '';
    this.lastModified = options.lastModified || Date.now();
  }
}

global.File = MockFile;
