module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(`${message ? ` ${message}` : ''}`);
    this.name = 'BadRequestError';
  }
};
