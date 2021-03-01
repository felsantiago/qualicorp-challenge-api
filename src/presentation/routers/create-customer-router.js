const HttpResponse = require('../helpers/http-response');
const { MissingParamError } = require('../../utils/errors');
const handleException = require('../../utils/errors/handle-exception');

module.exports = class CreateCustomerRouter {
  constructor({ createCustomerUseCase } = {}) {
    this.createCustomerUseCase = createCustomerUseCase;
  }

  async route(httpRequest) {
    try {
      const { name, email, telephone, cpf } = httpRequest.body;

      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'));
      }

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'));
      }

      if (!telephone) {
        return HttpResponse.badRequest(new MissingParamError('telephone'));
      }

      if (!cpf) {
        return HttpResponse.badRequest(new MissingParamError('cpf'));
      }

      const customer = await this.createCustomerUseCase.store({
        name,
        email,
        telephone,
        cpf,
      });

      return HttpResponse.create(customer);
    } catch (error) {
      const resultException = handleException(error);
      if (resultException) return resultException;
      return HttpResponse.serverError();
    }
  }
};
