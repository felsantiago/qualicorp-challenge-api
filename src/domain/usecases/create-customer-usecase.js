const { MissingParamError } = require('../../utils/errors');

module.exports = class CreateCustomerUsecase {
  constructor({ createCustomerRepository } = {}) {
    this.createCustomerRepository = createCustomerRepository;
  }

  async store({ name, email, telephone, cpf }) {
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

    const customerInserted = await this.createCustomerRepository.create({
      name,
      email,
      telephone,
      cpf,
    });

    return customerInserted;
  }
};
