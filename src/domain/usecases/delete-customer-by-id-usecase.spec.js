/* eslint-disable import/no-extraneous-dependencies */
const chance = require('chance')();
const { ObjectId } = require('mongodb');

const { MissingParamError } = require('../../utils/errors');
const DeleteCustomerByIdUsecase = require('./delete-customer-by-id-usecase');

const newId = ObjectId;
const customer = {
  _id: newId,
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone(),
  cpf: chance.integer({ min: 0, max: 11 }),
};

const makeDeleteCustomerByIdRepository = () => {
  class DeleteCustomerByIdRepositorySpy {
    async delete({ id }) {
      this.id = id;
      return this.result;
    }
  }
  const deleteCustomerByIdRepositorySpy = new DeleteCustomerByIdRepositorySpy();
  deleteCustomerByIdRepositorySpy.result = {
    n: 1,
    ok: 1,
  };
  return deleteCustomerByIdRepositorySpy;
};

const makeLoadCustomerByIdUsecase = () => {
  class LoadCustomerByIdUsecaseSpy {
    async load({ id }) {
      this.id = id;
      return this.customer;
    }
  }
  const loadCustomerByIdUsecaseSpy = new LoadCustomerByIdUsecaseSpy();
  loadCustomerByIdUsecaseSpy.customer = customer;
  loadCustomerByIdUsecaseSpy.customerExist = undefined;
  return loadCustomerByIdUsecaseSpy;
};

const makeDeleteCustomerByIdRepositoryWithError = () => {
  class DeleteCustomerByIdRepositorySpy {
    async delete() {
      throw new Error();
    }
  }
  return new DeleteCustomerByIdRepositorySpy();
};

const makeSut = () => {
  const deleteCustomerByIdRepositorySpy = makeDeleteCustomerByIdRepository();
  const loadCustomerByIdUsecaseSpy = makeLoadCustomerByIdUsecase();

  const sut = new DeleteCustomerByIdUsecase({
    deleteCustomerByIdRepository: deleteCustomerByIdRepositorySpy,
    loadCustomerByIdUsecase: loadCustomerByIdUsecaseSpy,
  });

  return {
    sut,
    deleteCustomerByIdRepositorySpy,
    loadCustomerByIdUsecaseSpy,
  };
};

describe('Delete customer UseCase', () => {
  test('Should throw if no parameter is provided', () => {
    const { sut } = makeSut();
    const promise = sut.delete({});
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });

  test('Should call DeleteCustomerByIdRepositorySpy with correct values', async () => {
    const { sut, deleteCustomerByIdRepositorySpy } = makeSut();
    await sut.delete({ id: newId });

    expect(deleteCustomerByIdRepositorySpy.customerExist).toEqual();
  });

  test('Should throw if invalid dependencies are provided', () => {
    const invalid = {};
    const deleteCustomerByIdRepositorySpy = makeDeleteCustomerByIdRepository();
    const loadCustomerByIdUsecaseSpy = makeLoadCustomerByIdUsecase();

    const suts = [].concat(
      new DeleteCustomerByIdUsecase(),
      new DeleteCustomerByIdUsecase({}),
      new DeleteCustomerByIdUsecase({
        deleteCustomerByIdRepository: invalid,
      }),
      new DeleteCustomerByIdUsecase({
        loadCustomerByIdUsecase: invalid,
      }),
      new DeleteCustomerByIdUsecase({
        deleteCustomerByIdRepository: deleteCustomerByIdRepositorySpy,
        loadCustomerByIdUsecase: invalid,
      }),
      new DeleteCustomerByIdUsecase({
        deleteCustomerByIdRepository: invalid,
        loadCustomerByIdUsecase: loadCustomerByIdUsecaseSpy,
      })
    );
    suts.forEach((sut) => {
      const promise = sut.delete({ id: newId });
      expect(promise).rejects.toThrow();
    });
  });

  test('Should throw if any dependency throws', () => {
    const loadCustomerByIdUsecaseSpy = makeLoadCustomerByIdUsecase();

    const suts = [].concat(
      new DeleteCustomerByIdUsecase({
        deleteCustomerByIdRepository: makeDeleteCustomerByIdRepositoryWithError(),
        loadCustomerByIdUsecase: loadCustomerByIdUsecaseSpy,
      })
    );
    suts.forEach((sut) => {
      const promise = sut.delete({ id: newId });
      expect(promise).rejects.toThrow();
    });
  });
});
