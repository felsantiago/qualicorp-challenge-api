const InvalidParamError = require('./invalid-param-error');

it('should throw InvalidParamError', () => {
  function invalidParamError() {
    throw new InvalidParamError('Error');
  }
  expect(invalidParamError).toThrow(InvalidParamError);
});

it('should throw InvalidParamError message default', () => {
  function invalidParamError() {
    throw new InvalidParamError();
  }
  expect(invalidParamError).toThrow(InvalidParamError);
});
