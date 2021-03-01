/* eslint-disable import/no-extraneous-dependencies */
const chance = require('chance')();

const { MissingParamError } = require('../../utils/errors');
const CreateCustomerUsecase = require('./create-customer-usecase');

const body = {
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone(),
  cpf: chance.integer({ min: 0, max: 11 }),
};

const makeCreateCustomerRepository = () => {
  class CreateCustomerRepositorySpy {
    async create(data) {
      this.data = data;
      return this.customer;
    }
  }
  const createCustomerRepositorySpy = new CreateCustomerRepositorySpy();
  createCustomerRepositorySpy.customer = body;
  return createCustomerRepositorySpy;
};

const makeCreateCustomerRepositoryWithError = () => {
  class CreateCustomerRepositorySpy {
    async create() {
      throw new Error();
    }
  }
  return new CreateCustomerRepositorySpy();
};

const makeSut = () => {
  const createCustomerRepositorySpy = makeCreateCustomerRepository();

  const sut = new CreateCustomerUsecase({
    createCustomerRepository: createCustomerRepositorySpy,
  });

  return {
    sut,
    createCustomerRepositorySpy,
  };
};

describe('Create customer UseCase', () => {
  test('Should throw if no name is provided', () => {
    const { sut } = makeSut();
    const promise = sut.store({});
    expect(promise).rejects.toThrow(new MissingParamError('name'));
  });

  test('Should throw if no email is provided', () => {
    const { sut } = makeSut();
    const name = chance.name();
    const promise = sut.store({ name });
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  test('Should throw if no telephone is provided', () => {
    const { sut } = makeSut();
    const name = chance.name();
    const email = chance.email();
    const promise = sut.store({ name, email });
    expect(promise).rejects.toThrow(new MissingParamError('telephone'));
  });

  test('Should throw if no cpf is provided', () => {
    const { sut } = makeSut();
    const name = chance.name();
    const email = chance.email();
    const telephone = chance.phone();
    const promise = sut.store({ name, email, telephone });
    expect(promise).rejects.toThrow(new MissingParamError('cpf'));
  });

  test('Should call CreateCustomerRepository with correct values', async () => {
    const { sut, createCustomerRepositorySpy } = makeSut();
    await sut.store({
      name: body.name,
      email: body.email,
      telephone: body.telephone,
      cpf: body.cpf,
    });

    expect(createCustomerRepositorySpy.customer).toEqual({
      name: body.name,
      email: body.email,
      telephone: body.telephone,
      cpf: body.cpf,
    });
  });

  test('Should throw if invalid dependencies are provided', () => {
    const invalid = {};

    const suts = [].concat(
      new CreateCustomerUsecase(),
      new CreateCustomerUsecase({}),
      new CreateCustomerUsecase({
        createCustomerRepository: invalid,
      }),
    );
    suts.forEach((sut) => {
      const promise = sut.store();
      expect(promise).rejects.toThrow();
    });
  });

  test('Should throw if any dependency throws', () => {
    const suts = [].concat(
      new CreateCustomerUsecase({
        createCustomerRepository: makeCreateCustomerRepositoryWithError(),
      })
    );
    suts.forEach((sut) => {
      const promise = sut.store({
        name: body.name,
        email: body.email,
        telephone: body.telephone,
        cpf: body.cpf,
      });
      expect(promise).rejects.toThrow();
    });
  });
});
