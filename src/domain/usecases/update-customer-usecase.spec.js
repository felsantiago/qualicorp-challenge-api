/* eslint-disable import/no-extraneous-dependencies */
const chance = require('chance')();
const { ObjectId } = require('mongodb');

const { MissingParamError } = require('../../utils/errors');
const UpdateCustomerUsecase = require('./update-customer-usecase');

const newId = ObjectId;
const body = {
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone(),
  cpf: chance.integer({ min: 0, max: 11 }),
};

const makeUpdateCustomerRepository = () => {
  class UpdateCustomerRepositorySpy {
    async update(data) {
      this.data = data;
      return this.customer;
    }
  }
  const updateCustomerRepositorySpy = new UpdateCustomerRepositorySpy();
  updateCustomerRepositorySpy.customer = body;
  return updateCustomerRepositorySpy;
};

const makeCreateCustomerRepositoryWithError = () => {
  class UpdateCustomerRepositorySpy {
    async create() {
      throw new Error();
    }
  }
  return new UpdateCustomerRepositorySpy();
};

const makeSut = () => {
  const updateCustomerRepositorySpy = makeUpdateCustomerRepository();

  const sut = new UpdateCustomerUsecase({
    updateCustomerRepository: updateCustomerRepositorySpy,
  });

  return {
    sut,
    updateCustomerRepositorySpy,
  };
};

describe('Create customer UseCase', () => {
  test('Should throw if no id is provided', () => {
    const { sut } = makeSut();
    const promise = sut.update(undefined, {});
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });

  test('Should throw if no name is provided', () => {
    const { sut } = makeSut();
    const promise = sut.update({ id: newId }, {});
    expect(promise).rejects.toThrow(new MissingParamError('name'));
  });

  test('Should throw if no email is provided', () => {
    const { sut } = makeSut();
    const name = chance.name();
    const promise = sut.update({ id: newId }, { name });
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('Should throw if no telephone is provided', () => {
    const { sut } = makeSut();
    const name = chance.name();
    const email = chance.email();
    const promise = sut.update({ id: newId }, { name, email });
    expect(promise).rejects.toThrow(new MissingParamError('telephone'));
  });

  test('Should throw if no cpf is provided', () => {
    const { sut } = makeSut();
    const name = chance.name();
    const email = chance.email();
    const telephone = chance.phone();
    const promise = sut.update({ id: newId }, { name, email, telephone });
    expect(promise).rejects.toThrow(new MissingParamError('cpf'));
  });

  test('Should call CreateCustomerRepository with correct values', async () => {
    const { sut, updateCustomerRepositorySpy } = makeSut();
    await sut.update(newId, {
      name: body.name,
      email: body.email,
      telephone: body.telephone,
      cpf: body.cpf,
    });

    expect(updateCustomerRepositorySpy.customer).toEqual({
      name: body.name,
      email: body.email,
      telephone: body.telephone,
      cpf: body.cpf,
    });
  });

  test('Should throw if invalid dependencies are provided', () => {
    const invalid = {};

    const suts = [].concat(
      new UpdateCustomerUsecase(),
      new UpdateCustomerUsecase({}),
      new UpdateCustomerUsecase({
        updateCustomerRepositorySpy: invalid,
      }),
    );
    suts.forEach((sut) => {
      const promise = sut.update();
      expect(promise).rejects.toThrow();
    });
  });

  test('Should throw if any dependency throws', () => {
    const suts = [].concat(
      new UpdateCustomerUsecase({
        updateCustomerRepositorySpy: makeCreateCustomerRepositoryWithError(),
      })
    );
    suts.forEach((sut) => {
      const promise = sut.update({
        name: body.name,
        email: body.email,
        telephone: body.telephone,
        cpf: body.cpf,
      });
      expect(promise).rejects.toThrow();
    });
  });
});
