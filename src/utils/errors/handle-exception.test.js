const HandleException = require('./handle-exception');
const httpResponse = require('../../presentation/helpers/http-response');

it('should throw HandleException Error', () => {
  const error = { statusCode: 200, message: '' };
  expect(HandleException(error)).toBe(error);
});

it('should throw HandleException InvalidParamError', () => {
  const error = { name: 'InvalidParamError' };
  expect(HandleException(error)).toEqual(httpResponse.badRequest(error));
});

it('should throw HandleException MissingParamError', () => {
  const error = { name: 'MissingParamError' };
  expect(HandleException(error)).toEqual(httpResponse.badRequest(error));
});

it('should throw HandleException NotFoundError', () => {
  const error = { name: 'NotFoundError' };
  expect(HandleException(error)).toEqual(httpResponse.notFound(error));
});
