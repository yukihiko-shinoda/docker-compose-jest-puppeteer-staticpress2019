// Mock implementation of @faker-js/faker for Jest tests
// This provides a minimal mock that satisfies the typeorm-fixtures-cli requirements

class FakerMock {
  constructor() {
    this.name = {
      firstName: () => 'John',
      lastName: () => 'Doe',
      findName: () => 'John Doe'
    };
    this.internet = {
      email: () => 'test@example.com',
      userName: () => 'testuser',
      url: () => 'http://example.com'
    };
    this.random = {
      number: () => 42,
      word: () => 'word',
      words: () => 'random words',
      uuid: () => '12345678-1234-1234-1234-123456789012'
    };
    this.lorem = {
      sentence: () => 'Lorem ipsum dolor sit amet.',
      paragraph: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    };
    this.datatype = {
      number: () => 42,
      boolean: () => true,
      string: () => 'string'
    };
  }
}

const faker = new FakerMock();

module.exports = { faker };
