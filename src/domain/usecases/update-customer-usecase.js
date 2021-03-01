const { MissingParamError } = require('../../utils/errors');

module.exports = class UpdateCustomerUsecase {
  constructor({ updateCustomerRepository } = {}) {
    this.updateCustomerRepository = updateCustomerRepository;
  }

  async update(id, { name, email, telephone, cpf }) {
    if (!id) {
      throw new MissingParamError('id');
    }
    if (!name) {
      throw new MissingParamError('name');
    }
    if (!email) {
      throw new MissingParamError('email');
    }
    if (!telephone) {
      throw new MissingParamError('telephone');
    }
    if (!cpf) {
      throw new MissingParamError('cpf');
    }

    const customerUpdated = await this.updateCustomerRepository.update(id, {
      name,
      email,
      telephone,
      cpf,
    });

    return customerUpdated;
  }
};
