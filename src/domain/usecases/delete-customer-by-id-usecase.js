const { MissingParamError } = require('../../utils/errors');
const { NotFoundError } = require('../../utils/errors/index');

module.exports = class DeleteCustomerByIdUsecase {
  constructor({ deleteCustomerByIdRepository, loadCustomerByIdUsecase } = {}) {
    this.deleteCustomerByIdRepository = deleteCustomerByIdRepository;
    this.loadCustomerByIdUsecase = loadCustomerByIdUsecase;
  }

  async delete({ id }) {
    if (!id) {
      throw new MissingParamError('id');
    }

    const customerExist = await this.loadCustomerByIdUsecase.load({ id });
    if (!customerExist) {
      throw new NotFoundError('Customer not found');
    }

    const customer = await this.deleteCustomerByIdRepository.delete({
      id,
    });

    return customer;
  }
};
