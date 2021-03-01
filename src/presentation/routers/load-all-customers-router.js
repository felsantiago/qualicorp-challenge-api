const HttpResponse = require('../helpers/http-response');
const handleException = require('../../utils/errors/handle-exception');

module.exports = class LoadAllCustomersRouter {
  constructor({ loadAllCustomersUsecase } = {}) {
    this.loadAllCustomersUsecase = loadAllCustomersUsecase;
  }

  async route() {
    try {
      const customers = await this.loadAllCustomersUsecase.load();

      return HttpResponse.ok(customers);
    } catch (error) {
      const resultException = handleException(error);
      if (resultException) return resultException;
      return HttpResponse.serverError();
    }
  }
};
