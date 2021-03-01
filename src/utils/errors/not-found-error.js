module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(`${message ? ` ${message}` : 'Register not found'}`);
    this.name = 'NotFoundError';
  }
};
