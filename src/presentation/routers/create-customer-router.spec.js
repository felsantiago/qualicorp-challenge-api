const chance = require('chance')();
const CreateCustomerRouter = require('./create-customer-router');
const { MissingParamError } = require('../../utils/errors');
const { ServerError } = require('../errors');

const body = {
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone({ formatted: false }),
  cpf: chance.integer({ min: 1, max: 11 }),
};

const makeCreateCustomerUseCase = () => {
  class CreateCustomerUseCaseSpy {
    async store({ name, email, telephone, cpf }) {
      this.name = name;
      this.email = email;
      this.telephone = telephone;
      this.cpf = cpf;
    }
  }
  return new CreateCustomerUseCaseSpy();
};

const makeSut = () => {
  const createCustomerUseCaseSpy = makeCreateCustomerUseCase();

  const sut = new CreateCustomerRouter({
    createCustomerUseCase: createCustomerUseCaseSpy,
  });
  return {
    sut,
    createCustomerUseCaseSpy,
  };
};

const makeCreateCustomerUseCaseWithError = () => {
  class CreateCustomerUseCaseSpy {
    async store() {
      throw new Error();
    }
  }
  return new CreateCustomerUseCaseSpy();
};

describe('Create customer Router', () => {
  describe('Sucess case', () => {
    test('Should call CreateCustomerUseCase with correct params', async () => {
      const { sut, createCustomerUseCaseSpy } = makeSut();
      const httpRequest = {
        body,
      };
      await sut.route(httpRequest);
      expect(createCustomerUseCaseSpy.name).toBe(httpRequest.body.name);
      expect(createCustomerUseCaseSpy.email).toBe(httpRequest.body.email);
      expect(createCustomerUseCaseSpy.telephone).toBe(
        httpRequest.body.telephone
      );
      expect(createCustomerUseCaseSpy.cpf).toBe(httpRequest.body.cpf);
    });
  });

  describe('failure cases', () => {
    test('Should return 400 when not providing name', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        body: {
          email: chance.email(),
          telephone: chance.phone({ formatted: false }),
          cpf: chance.integer({ min: 1, max: 11 }),
        },
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
        new CreateCustomerRouter(),
        new CreateCustomerRouter({}),
        new CreateCustomerRouter({
          createCustomerUseCase: invalid,
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          body,
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });

    test('Should throw if any dependency throws', async () => {
      const suts = [].concat(
        new CreateCustomerRouter({
          createCustomerUseCase: makeCreateCustomerUseCaseWithError(),
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          body,
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });
  });
});
