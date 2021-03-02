const { ObjectId } = require('mongodb');
const chance = require('chance')();
const UpdateCustomerRouter = require('./update-customer-router');
const { MissingParamError } = require('../../utils/errors');
const { ServerError } = require('../errors');

const newId = ObjectId;
const body = {
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone({ formatted: false }),
  cpf: chance.integer({ min: 1, max: 11 }),
};

const makeUpdateCustomerUseCase = () => {
  class UpdateCustomerUseCaseSpy {
    async update(id, { name, email, telephone, cpf }) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.telephone = telephone;
      this.cpf = cpf;
    }
  }
  return new UpdateCustomerUseCaseSpy();
};

const makeSut = () => {
  const updateCustomerUseCaseSpy = makeUpdateCustomerUseCase();

  const sut = new UpdateCustomerRouter({
    updateCustomerUseCase: updateCustomerUseCaseSpy,
  });
  return {
    sut,
    updateCustomerUseCaseSpy,
  };
};

const makeUpdateCustomerUseCaseWithError = () => {
  class UpdateCustomerUseCaseSpy {
    async update() {
      throw new Error();
    }
  }
  return new UpdateCustomerUseCaseSpy();
};

describe('Create customer Router', () => {
  describe('Sucess case', () => {
    test('Should call UpdateCustomerUseCase with correct params', async () => {
      const { sut, updateCustomerUseCaseSpy } = makeSut();
      const httpRequest = {
        body,
        params: { id: newId }
      };
      await sut.route(httpRequest);
      expect(updateCustomerUseCaseSpy.name).toBe(httpRequest.body.name);
      expect(updateCustomerUseCaseSpy.email).toBe(httpRequest.body.email);
      expect(updateCustomerUseCaseSpy.telephone).toBe(
        httpRequest.body.telephone
      );
      expect(updateCustomerUseCaseSpy.cpf).toBe(httpRequest.body.cpf);
    });
  });

  describe('failure cases', () => {
    test('Should return 400 when not providing id', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body,
        params: {},
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.error).toBe(
        new MissingParamError('id').message
      );
    });

    test('Should return 400 when not providing name', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: chance.email(),
          telephone: chance.phone({ formatted: false }),
          cpf: chance.integer({ min: 1, max: 11 }),
        },
        params: { id: newId },
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.error).toBe(
        new MissingParamError('name').message
      );
    });

    test('Should return 400 when not providing email', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: chance.name(),
          telephone: chance.phone({ formatted: false }),
          cpf: chance.integer({ min: 1, max: 11 }),
        },
        params: { id: newId },
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.error).toBe(
        new MissingParamError('email').message
      );
    });

    test('Should return 400 when not providing telephone', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: chance.name(),
          email: chance.email(),
          cpf: chance.integer({ min: 1, max: 11 }),
        },
        params: { id: newId },
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.error).toBe(
        new MissingParamError('telephone').message
      );
    });

    test('Should return 400 when not providing cpf', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          name: chance.name(),
          email: chance.email(),
          telephone: chance.phone({ formatted: false }),
        },
        params: { id: newId },
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.error).toBe(
        new MissingParamError('cpf').message
      );
    });
  });

  describe('Dependency injection error cases', () => {
    test('Should throw if invalid dependencies are provided', async () => {
      const invalid = {};
      const suts = [].concat(
        new UpdateCustomerRouter(),
        new UpdateCustomerRouter({}),
        new UpdateCustomerRouter({
          updateCustomerUseCase: invalid,
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          body,
          params: { id: newId },
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });

    test('Should throw if any dependency throws', async () => {
      const suts = [].concat(
        new UpdateCustomerRouter({
          updateCustomerUseCase: makeUpdateCustomerUseCaseWithError(),
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          body,
          params: { id: newId },
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });
  });
});
