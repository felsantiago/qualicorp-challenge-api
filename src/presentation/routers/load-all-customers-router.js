const HttpResponse = require('../helpers/http-response');

module.exports = class LoadAllCustomersRouter {
  constructor({ loadAllCustomersUsecase } = {}) {
    this.loadAllCustomersUsecase = loadAllCustomersUsecase;
  }

  async route() {
    try {
      const customers = await this.loadAllCustomersUsecase.load();

      return HttpResponse.ok(customers);
    } catch (error) {
      return HttpResponse.serverError();
    }
  }
};
