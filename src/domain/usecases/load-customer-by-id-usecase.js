const { MissingParamError } = require('../../utils/errors');

module.exports = class LoadCustomerByIdUsecase {
  constructor({ loadCustomerByIdRepository } = {}) {
    this.loadCustomerByIdRepository = loadCustomerByIdRepository;
  }

  async load({ id }) {
    if (!id) {
      throw new MissingParamError('id');
    }

    const customer = await this.loadCustomerByIdRepository.load({
      id,
    });

    return customer;
  }
};
