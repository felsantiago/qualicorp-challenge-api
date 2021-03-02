const { ObjectId } = require('mongodb');
const chance = require('chance')();
const LoadAllCustomersRouter = require('./load-all-customers-router');
const { ServerError } = require('../errors');

const newId = ObjectId;
const returnList = [
  {
    _id: newId,
    name: chance.name(),
    email: chance.email(),
    telephone: chance.phone({ formatted: false }),
    cpf: chance.integer({ min: 1, max: 11 }),
  },
  {
    _id: newId,
    name: chance.name(),
    email: chance.email(),
    telephone: chance.phone({ formatted: false }),
    cpf: chance.integer({ min: 1, max: 11 }),
  },
];

const makeLoadAllCustomersUsecase = () => {
  class LoadAllCustomersUsecaseSpy {
    async load() {
      this.customers = returnList;
      return returnList;
    }
  }
  return new LoadAllCustomersUsecaseSpy();
};

const makeSut = () => {
  const loadAllCustomersUsecaseSpy = makeLoadAllCustomersUsecase();

  const sut = new LoadAllCustomersRouter({
    loadAllCustomersUsecase: loadAllCustomersUsecaseSpy,
  });
  return {
    sut,
    loadAllCustomersUsecaseSpy,
  };
};

const makeLoadAllCustomersUsecaseWithError = () => {
  class LoadAllCustomersUsecaseSpy {
    async update() {
      throw new Error();
    }
  }
  return new LoadAllCustomersUsecaseSpy();
};

describe('Load customers Router', () => {
  describe('Sucess case', () => {
    test('Should call LoadAllCustomersUsecase with correct params', async () => {
      const { sut, loadAllCustomersUsecaseSpy } = makeSut();
      const response = await sut.route();
      expect.arrayContaining(loadAllCustomersUsecaseSpy.customers);
      expect.arrayContaining(response.body);
      expect(loadAllCustomersUsecaseSpy.customers).toEqual(response.body);
    });
  });

  describe('Dependency injection error cases', () => {
    test('Should throw if invalid dependencies are provided', async () => {
      const invalid = {};
      const suts = [].concat(
        new LoadAllCustomersRouter(),
        new LoadAllCustomersRouter({}),
        new LoadAllCustomersRouter({
          loadAllCustomersUsecase: invalid,
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {};
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });

    test('Should throw if any dependency throws', async () => {
      const suts = [].concat(
        new LoadAllCustomersRouter({
          loadAllCustomersUsecase: makeLoadAllCustomersUsecaseWithError(),
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {};
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });
  });
});
