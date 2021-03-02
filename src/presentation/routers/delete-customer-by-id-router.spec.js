const { ObjectId } = require('mongodb');
const DeleteCustomerByIdRouter = require('./delete-customer-by-id-router');
const { ServerError } = require('../errors');
const { MissingParamError } = require('../../utils/errors');

const newId = ObjectId;
const returnDeleted = {
  n: 1,
  ok: 1,
};

const makeDeleteCustomerByIdRouter = () => {
  class DeleteCustomerByIdRouterSpy {
    async delete() {
      this.customer = returnDeleted;
      return returnDeleted;
    }
  }
  return new DeleteCustomerByIdRouterSpy();
};

const makeSut = () => {
  const deleteCustomerByIdUsecaseSpy = makeDeleteCustomerByIdRouter();

  const sut = new DeleteCustomerByIdRouter({
    deleteCustomerByIdUsecase: deleteCustomerByIdUsecaseSpy,
  });
  return {
    sut,
    deleteCustomerByIdUsecaseSpy,
  };
};

const makeDeleteCustomerByIdRouterWithError = () => {
  class DeleteCustomerByIdRouterSpy {
    async update() {
      throw new Error();
    }
  }
  return new DeleteCustomerByIdRouterSpy();
};

describe('Delete customers Router', () => {
  describe('Sucess case', () => {
    test('Should call DeleteCustomerByIdRouter with correct params', async () => {
      const { sut, deleteCustomerByIdUsecaseSpy } = makeSut();
      const httpRequest = {
        params: { id: newId },
      };
      const response = await sut.route(httpRequest);
      expect(deleteCustomerByIdUsecaseSpy.customer).toEqual(response.body);
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
      expect(httpResponse.body.error).toBe(new MissingParamError('id').message);
    });
  });

  describe('Dependency injection error cases', () => {
    test('Should throw if invalid dependencies are provided', async () => {
      const invalid = {};
      const suts = [].concat(
        new DeleteCustomerByIdRouter(),
        new DeleteCustomerByIdRouter({}),
        new DeleteCustomerByIdRouter({
          deleteCustomerByIdUsecase: invalid,
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          params: { id: newId },
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });

    test('Should throw if any dependency throws', async () => {
      const suts = [].concat(
        new DeleteCustomerByIdRouter({
          deleteCustomerByIdUsecase: makeDeleteCustomerByIdRouterWithError(),
        })
      );
      suts.forEach(async (sut) => {
        const httpRequest = {
          params: { id: newId },
        };
        const httpResponse = await sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.error).toBe(new ServerError().message);
      });
    });
  });
});
