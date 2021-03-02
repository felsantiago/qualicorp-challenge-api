const BadRequestError = require('./bad-request-error');

it('should throw BadRequestError', () => {
  function badRequestError() {
    throw new BadRequestError('Error');
  }
  expect(badRequestError).toThrow(BadRequestError);
});

it('should throw BadRequestError message default', () => {
  function badRequestError() {
    throw new BadRequestError();
  }
  expect(badRequestError).toThrow(BadRequestError);
});
