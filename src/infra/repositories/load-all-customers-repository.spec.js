const chance = require('chance')();

const MongoHelper = require('../helpers/mongo-helper');

let customerModel;
let customers;

describe('LoadCustomers Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    customerModel = await MongoHelper.getCollection('customers');
  });

  beforeEach(async () => {
    await customerModel.deleteMany();
    await customerModel.insertMany([
      {
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      },
      {
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      },
      {
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      },
    ]);
    customers = await customerModel.find().toArray();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return all customers', async () => {
    const resultCustomers = await customerModel.find().toArray();
    expect.arrayContaining(customers);
    expect.arrayContaining(resultCustomers);
    expect(customers).toEqual(resultCustomers);
  });
});
