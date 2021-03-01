const CreateCustomerRouter = require('../../presentation/routers/create-customer-router');
const CreateCustomerUseCase = require('../../domain/usecases/create-customer-usecase');
const CreateCustomerRepository = require('../../infra/repositories/create-customer-repository');

module.exports = class CreateCustomerComposer {
  static compose() {
    const createCustomerRepository = new CreateCustomerRepository();

    const createCustomerUseCase = new CreateCustomerUseCase({
      createCustomerRepository,
    });

    return new CreateCustomerRouter({
      createCustomerUseCase,
    });
  }
};
