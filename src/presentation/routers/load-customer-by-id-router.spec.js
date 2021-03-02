const { ObjectId } = require('mongodb');
const chance = require('chance')();
const LoadCustomerByIdRouter = require('./load-customer-by-id-router');
const { ServerError } = require('../errors');
const { MissingParamError } = require('../../utils/errors');

const newId = ObjectId;
const returnCustomer = {
  _id: newId,
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone({ formatted: false }),
  cpf: chance.integer({ min: 1, max: 11 }),
};

const makeLoadCustomerByIdUsecase = () => {
  class LoadCustomerByIdUsecaseSpy {
    async load() {
      this.customer = returnCustomer;
      return returnCustomer;
    }
  }
  return new LoadCustomerByIdUsecaseSpy();
};

const makeSut = () => {
  const loadCustomerByIdUsecaseSpy = makeLoadCustomerByIdUsecase();

  const sut = new LoadCustomerByIdRouter({
    loadCustomerByIdUsecase: loadCustomerByIdUsecaseSpy,
  });
  return {
    sut,
    loadCustomerByIdUsecaseSpy,
  };
};

const makeLoadCustomerByIdUsecaseWithError = () => {
  class LoadCustomerByIdUsecaseSpy {
    async update() {
      throw new Error();
    }
  }
  return new LoadCustomerByIdUsecaseSpy();
};

describe('Load customers Router', () => {
  describe('Sucess case', () => {
    test('Should call LoadCustomerByIdUsecase with correct params', async () => {
      const { sut, loadCustomerByIdUsecaseSpy } = makeSut();
      const httpRequest = {
        params: { id: newId }
      }
      const response = await sut.route(httpRequest);
      expect(loadCustomerByIdUsecaseSpy.customer).toEqual(response.body);
    });
  });

  describe('failure cases', () => {
    test('Should return 400 when not providing id', async () => {
      const { sut } = makeSut();
      const httpRequest = {
        params: {},
      };
      const httpResponse = await sut.route(httpRequest);
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.error).toBe(
        new MissingParamError('id').message
      );
    });
  });

  describe('Dependency injection error cases', () => {
    test('Should throw if invalid dependencies are provided', async () => {
      const invalid = {};
      const suts = [].concat(
        new LoadCustomerByIdRouter(),
        new LoadCustomerByIdRouter({}),
        new LoadCustomerByIdRouter({
          loadCustomerByIdUsecase: invalid,
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          params: { id: newId }
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });

    test('Should throw if any dependency throws', async () => {
      const suts = [].concat(
        new LoadCustomerByIdRouter({
          loadCustomerByIdUsecase: makeLoadCustomerByIdUsecaseWithError(),
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          params: { id: newId }
        }
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });
  });
});
