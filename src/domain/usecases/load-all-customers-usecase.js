module.exports = class LoadAllCustomersUsecase {
  constructor({ loadAllCustomersRepository } = {}) {
    this.loadAllCustomersRepository = loadAllCustomersRepository;
  }

  async load() {
    const customers = await this.loadAllCustomersRepository.load();

    return customers;
  }
};
