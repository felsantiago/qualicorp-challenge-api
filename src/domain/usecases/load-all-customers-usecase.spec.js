/* eslint-disable import/no-extraneous-dependencies */
const chance = require('chance')();
const { ObjectId } = require('mongodb');

const LoadAllCustomersUsecase = require('./load-all-customers-usecase');

const newId = ObjectId;
const customers = [
  {
    _id: newId,
    name: chance.name(),
    email: chance.email(),
    telephone: chance.phone(),
    cpf: chance.integer({ min: 0, max: 11 }),
  },
  {
    _id: newId,
    name: chance.name(),
    email: chance.email(),
    telephone: chance.phone(),
    cpf: chance.integer({ min: 0, max: 11 }),
  },
];

const makeLoadAllCustomersRepository = () => {
  class LoadAllCustomersRepositorySpy {
    async load() {
      return this.customer;
    }
  }
  const loadAllCustomersRepositorySpy = new LoadAllCustomersRepositorySpy();
  loadAllCustomersRepositorySpy.customers = customers;
  return loadAllCustomersRepositorySpy;
};

const makeLoadAllCustomersUsecaseWithError = () => {
  class LoadAllCustomersUsecaseSpy {
    async load() {
      throw new Error();
    }
  }
  return new LoadAllCustomersUsecaseSpy();
};

const makeSut = () => {
  const loadAllCustomersRepositorySpy = makeLoadAllCustomersRepository();

  const sut = new LoadAllCustomersUsecase({
    loadAllCustomersRepository: loadAllCustomersRepositorySpy,
  });

  return {
    sut,
    loadAllCustomersRepositorySpy,
  };
};

describe('Load all customers UseCase', () => {
  test('Should call LoadAllCustomersUsecase with correct values', async () => {
    const { sut, loadAllCustomersRepositorySpy } = makeSut();
    await sut.load();

    expect(loadAllCustomersRepositorySpy.customers).toEqual(customers);
  });

  test('Should throw if invalid dependencies are provided', () => {
    const invalid = {};

    const suts = [].concat(
      new LoadAllCustomersUsecase(),
      new LoadAllCustomersUsecase({}),
      new LoadAllCustomersUsecase({
        loadCustomerByIdRepository: invalid,
      })
    );
    suts.forEach((sut) => {
      const promise = sut.load();
      expect(promise).rejects.toThrow();
    });
  });

  test('Should throw if any dependency throws', () => {
    const suts = [].concat(
      new LoadAllCustomersUsecase({
        loadCustomerByIdRepository: makeLoadAllCustomersUsecaseWithError(),
      })
    );
    suts.forEach((sut) => {
      const promise = sut.load();
      expect(promise).rejects.toThrow();
    });
  });
});
