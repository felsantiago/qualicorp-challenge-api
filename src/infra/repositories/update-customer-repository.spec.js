const { ObjectId } = require('mongodb');
const chance = require('chance')();
const MongoHelper = require('../helpers/mongo-helper');
const UpdateCustomerRepository = require('./update-customer-repository');
const MissingParamError = require('../../utils/errors/missing-param-error');

let customerModel;

const newId = ObjectId;
const body = {
  name: chance.name(),
  email: chance.email(),
  telephone: chance.phone(),
  cpf: chance.integer({ min: 0, max: 11 }),
};
const makeSut = () => new UpdateCustomerRepository();

describe('UpdateCustomer Repository', () => {
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
    const customer = await customerModel.updateOne(
      { _id: newId },
      {
        $set: body,
      }
    );

    expect(customer.result.ok).toEqual(1);
  });

  test('Should throw if no parameter id is provided', () => {
    const sut = makeSut();
    const promise = sut.update();
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });

  test('Should throw if no parameter data is provided', () => {
    const sut = makeSut();
    const promise = sut.update(newId);
    expect(promise).rejects.toThrow(new MissingParamError('data'));
  });
});
