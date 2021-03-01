const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');

module.exports = class CreateCustomerRepository {
  async create(data) {
    if (!data) {
      throw new MissingParamError('data');
    }

    const customerModel = await MongoHelper.getCollection('customers');
    const customer = await customerModel.insertOne(data);

    return customer.ops[0];
  }
};
