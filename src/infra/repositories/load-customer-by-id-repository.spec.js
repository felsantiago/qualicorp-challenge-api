const chance = require('chance')();
const { ObjectId } = require('mongodb');

const MongoHelper = require('../helpers/mongo-helper');
const LoadCustomerByIdRepository = require('./load-customer-by-id-repository');
const MissingParamError = require('../../utils/errors/missing-param-error');

let customerModel;
let customer;

const makeSut = () => new LoadCustomerByIdRepository();

describe('LoadCustomerById Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    customerModel = await MongoHelper.getCollection('customers');
  });

  beforeEach(async () => {
    await customerModel.deleteMany();
    customer = await customerModel.insertOne({
      name: chance.name(),
      email: chance.email(),
      telephone: chance.phone(),
      cpf: chance.integer({ min: 0, max: 11 }),
    });
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return all customers', async () => {
    const resultCustomers = await customerModel.findOne({
      _id: new ObjectId(customer.ops[0]._id),
    });
    expect(customer.ops[0]).toEqual(resultCustomers);
  });

  test('Should throw if no id is provided', () => {
    const sut = makeSut();
    const promise = sut.load({});
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
