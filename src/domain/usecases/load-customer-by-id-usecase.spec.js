/* eslint-disable import/no-extraneous-dependencies */
const chance = require('chance')();
const { ObjectId } = require('mongodb');

const { MissingParamError } = require('../../utils/errors');
const LoadCustomerByIdUsecase = require('./load-customer-by-id-usecase');

const newId = ObjectId;
const customer = {
  _id: newId,
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone(),
  cpf: chance.integer({ min: 0, max: 11 }),
};

const makeLoadCustomerByIdRepository = () => {
  class LoadCustomerByIdRepositorySpy {
    async load(id) {
      this.id = id;
      return this.customer;
    }
  }
  const loadCustomerByIdRepositorySpy = new LoadCustomerByIdRepositorySpy();
  loadCustomerByIdRepositorySpy.customer = customer;
  return loadCustomerByIdRepositorySpy;
};

const makeLoadCustomerByIdUsecaseWithError = () => {
  class LoadCustomerByIdUsecaseSpy {
    async load() {
      throw new Error();
    }
  }
  return new LoadCustomerByIdUsecaseSpy();
};

const makeSut = () => {
  const loadCustomerByIdRepositorySpy = makeLoadCustomerByIdRepository();

  const sut = new LoadCustomerByIdUsecase({
    loadCustomerByIdRepository: loadCustomerByIdRepositorySpy,
  });

  return {
    sut,
    loadCustomerByIdRepositorySpy,
  };
};

describe('Load customer UseCase', () => {
  test('Should throw if no id is provided', () => {
    const { sut } = makeSut();
    const promise = sut.load({ id: undefined });
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });

  test('Should call LoadCustomerByIdRepository with correct values', async () => {
    const { sut, loadCustomerByIdRepositorySpy } = makeSut();
    await sut.load({ id: newId });

    expect(loadCustomerByIdRepositorySpy.customer).toEqual(customer);
  });

  test('Should throw if invalid dependencies are provided', () => {
    const invalid = {};

    const suts = [].concat(
      new LoadCustomerByIdUsecase(),
      new LoadCustomerByIdUsecase({}),
      new LoadCustomerByIdUsecase({
        loadCustomerByIdRepository: invalid,
      })
    );
    suts.forEach((sut) => {
      const promise = sut.load({ id: newId });
      expect(promise).rejects.toThrow();
    });
  });

  test('Should throw if any dependency throws', () => {
    const suts = [].concat(
      new LoadCustomerByIdUsecase({
        loadCustomerByIdRepository: makeLoadCustomerByIdUsecaseWithError(),
      })
    );
    suts.forEach((sut) => {
      const promise = sut.load({ id: newId });
      expect(promise).rejects.toThrow();
    });
  });
});
