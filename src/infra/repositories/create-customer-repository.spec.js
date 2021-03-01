const chance = require('chance')();
const MongoHelper = require('../helpers/mongo-helper');
const CreateCustomerRepository = require('./create-customer-repository');
const MissingParamError = require('../../utils/errors/missing-param-error');

let customerModel;

const makeSut = () => new CreateCustomerRepository();

describe('CreateCustomer Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    customerModel = await MongoHelper.getCollection('customers');
  });

  beforeEach(async () => {
    await customerModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should register a new customer and return', async () => {
    const customer = await customerModel.insertOne({
      name: chance.name(),
      email: chance.email(),
      telephone: chance.phone(),
      cpf: chance.integer({ min: 0, max: 11 }),
    });
    expect(customer.ops[0]).toEqual({
      name: customer.ops[0].name,
      email: customer.ops[0].email,
      telephone: customer.ops[0].telephone,
      cpf: customer.ops[0].cpf,
      _id: customer.ops[0]._id,
    });
  });

  test('Should throw if no parameter is provided', () => {
    const sut = makeSut();
    const promise = sut.create();
    expect(promise).rejects.toThrow(new MissingParamError('data'));
  });
});
