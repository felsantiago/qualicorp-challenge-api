const DeleteCustomerByIdRepository = require('../../infra/repositories/delete-customer-by-id-repository');
const DeleteCustomerByIdRouter = require('../../presentation/routers/delete-customer-by-id-router');
const DeleteCustomerByIdUsecase = require('../../domain/usecases/delete-customer-by-id-usecase');
const LoadCustomerByIdUsecase = require('../../domain/usecases/load-customer-by-id-usecase');
const LoadCustomerByIdRepository = require('../../infra/repositories/load-customer-by-id-repository');

module.exports = class DeleteCustomerByIdComposer {
  static compose() {
    const deleteCustomerByIdRepository = new DeleteCustomerByIdRepository();
    const loadCustomerByIdRepository = new LoadCustomerByIdRepository();

    const loadCustomerByIdUsecase = new LoadCustomerByIdUsecase({
      loadCustomerByIdRepository,
    });

    const deleteCustomerByIdUsecase = new DeleteCustomerByIdUsecase({
      deleteCustomerByIdRepository,
      loadCustomerByIdUsecase,
    });

    return new DeleteCustomerByIdRouter({
      deleteCustomerByIdUsecase,
    });
  }
};
