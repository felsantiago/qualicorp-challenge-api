const httpResponse = require('../../presentation/helpers/http-response');

const execute = (error) => {
  if (error.statusCode) return error;
  if (error.name === 'InvalidParamError') {
    return httpResponse.badRequest(error);
  }
  if (error.name === 'MissingParamError') {
    return httpResponse.badRequest(error);
  }
  if (error.name === 'NotFoundError') {
    return httpResponse.notFound(error);
  }

  return null;
};

module.exports = execute;
