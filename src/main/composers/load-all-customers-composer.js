const LoadAllCustomersRepository = require('../../infra/repositories/load-all-customers-repository');
const LoadAllCustomersRouter = require('../../presentation/routers/load-all-customers-router');
const LoadAllCustomersUsecase = require('../../domain/usecases/load-all-customers-usecase');

module.exports = class LoadAllCustomersComposer {
  static compose() {
    const loadAllCustomersRepository = new LoadAllCustomersRepository();

    const loadAllCustomersUsecase = new LoadAllCustomersUsecase({
      loadAllCustomersRepository,
    });

    return new LoadAllCustomersRouter({
      loadAllCustomersUsecase,
    });
  }
};
