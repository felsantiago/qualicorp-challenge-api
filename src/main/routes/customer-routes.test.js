const chance = require('chance')();
const request = require('supertest');

const app = require('../config/app');
const MongoHelper = require('../../infra/helpers/mongo-helper');

let customerModel;

const mongoObjectId = () => {
  const timestamp = (new Date().getTime() / 1000 || 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, () => (Math.random() * 16 || 0).toString(16))
      .toLowerCase()
  );
};

describe('Customers Routes', () => {
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

  describe('Sucess case 200', () => {
    test('Should return 200 when there are customer records', async () => {
      await customerModel.insertOne({
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      });
      await request(app).get('/api/customers').send().expect(200);
    });

    test('Should return 200 when meeting the customer by the Id', async () => {
      const resultInserted = await customerModel.insertOne({
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      });
      const insertedId = String(resultInserted.insertedId);
      await request(app).get(`/api/customers/${insertedId}`).send().expect(200);
    });

    test('Should return 200 when a customer is successfully removed', async () => {
      const resultInserted = await customerModel.insertOne({
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      });
      const insertedId = String(resultInserted.insertedId);
      await request(app)
        .delete(`/api/customers/${insertedId}`)
        .send()
        .expect(200);
    });
  });

  describe('POST: Sucess case 201', () => {
    test('Should return 201 when successfully registering a customer', async () => {
      const data = {
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      };
      await request(app).post('/api/customers').send(data).expect(201);
    });
  });

  describe('POST: failure cases 400', () => {
    test('Should return 400 when not providing name', async () => {
      const data = {
        email: chance.email(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      };
      await request(app).post('/api/customers').send(data).expect(400);
    });

    test('Should return 400 when not providing email', async () => {
      const data = {
        name: chance.name(),
        telephone: chance.phone(),
        cpf: chance.integer({ min: 0, max: 11 }),
      };
      await request(app).post('/api/customers').send(data).expect(400);
    });

    test('Should return 400 when not providing telephone', async () => {
      const data = {
        name: chance.name(),
        email: chance.email(),
        cpf: chance.integer({ min: 0, max: 11 }),
      };
      await request(app).post('/api/customers').send(data).expect(400);
    });

    test('Should return 400 when not providing cpf', async () => {
      const data = {
        name: chance.name(),
        email: chance.email(),
        telephone: chance.phone(),
      };
      await request(app)
        .post('/api/customers')
        .send(data)
        .expect(400);
    });
  });

  describe('GET: failure cases 400', () => {
    test('Should return 400 when the Id is invalid', async () => {
      const invalidId = chance.hash();
      await request(app).get(`/api/customers/${invalidId}`).send().expect(400);
    });

    test('Should return 400 when there is no customer by the given id', async () => {
      await request(app)
        .get(`/api/customers/${String(mongoObjectId())}`)
        .send()
        .expect(400);
    });
  });

  describe('DELETE: failure cases 400', () => {
    test('Should return 400 when the Id is invalid', async () => {
      const invalidId = chance.hash();
      await request(app)
        .delete(`/api/customers/${invalidId}`)
        .send()
        .expect(400);
    });
  });
});
