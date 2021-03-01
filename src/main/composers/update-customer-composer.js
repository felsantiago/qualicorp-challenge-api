const UpdateCustomerRouter = require('../../presentation/routers/update-customer-router');
const UpdateCustomerUseCase = require('../../domain/usecases/update-customer-usecase');
const UpdateCustomerRepository = require('../../infra/repositories/update-customer-repository');

module.exports = class UpdateCustomerComposer {
  static compose() {
    const updateCustomerRepository = new UpdateCustomerRepository();

    const updateCustomerUseCase = new UpdateCustomerUseCase({
      updateCustomerRepository,
    });

    return new UpdateCustomerRouter({
      updateCustomerUseCase,
    });
  }
};
