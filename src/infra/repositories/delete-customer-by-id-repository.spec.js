const chance = require('chance')();
const { ObjectId } = require('mongodb');

const MongoHelper = require('../helpers/mongo-helper');
const DeleteCustomerByIdRepository = require('./delete-customer-by-id-repository');
const MissingParamError = require('../../utils/errors/missing-param-error');

let customerModel;
let customer;

const makeSut = () => new DeleteCustomerByIdRepository();

describe('DeleteCustomer Repository', () => {
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

  test('Should remove a customer', async () => {
    const expectResult = {
      n: 1,
      ok: 1,
    };
    const deleted = await customerModel.deleteOne({
      _id: new ObjectId(customer.ops[0]._id),
    });
    expect(expectResult).toEqual(deleted.result);
  });

  test('Should throw if no parameter is provided', () => {
    const sut = makeSut();
    const promise = sut.delete({});
    expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
