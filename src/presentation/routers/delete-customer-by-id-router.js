const HttpResponse = require('../helpers/http-response');
const { MissingParamError } = require('../../utils/errors');
const handleException = require('../../utils/errors/handle-exception');

module.exports = class DeleteCustomerByIdRouter {
  constructor({ deleteCustomerByIdUsecase } = {}) {
    this.deleteCustomerByIdUsecase = deleteCustomerByIdUsecase;
  }

  async route(httpRequest) {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return HttpResponse.badRequest(new MissingParamError('id'));
      }

      const customer = await this.deleteCustomerByIdUsecase.delete({
        id,
      });

      return HttpResponse.ok(customer);
    } catch (error) {
      const resultException = handleException(error);
      if (resultException) return resultException;
      return HttpResponse.serverError();
    }
  }
};
