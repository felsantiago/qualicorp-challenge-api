const LoadCustomerByIdRepository = require('../../infra/repositories/load-customer-by-id-repository');
const LoadCustomerByIdRouter = require('../../presentation/routers/load-customer-by-id-router');
const LoadCustomerByIdUsecase = require('../../domain/usecases/load-customer-by-id-usecase');

module.exports = class LoadCustomerByIdComposer {
  static compose() {
    const loadCustomerByIdRepository = new LoadCustomerByIdRepository();

    const loadCustomerByIdUsecase = new LoadCustomerByIdUsecase({
      loadCustomerByIdRepository,
    });

    return new LoadCustomerByIdRouter({
      loadCustomerByIdUsecase,
    });
  }
};
