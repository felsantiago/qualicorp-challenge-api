const MongoHelper = require('../helpers/mongo-helper');

module.exports = class LoadAllCustomersRepository {
  async load() {
    const customerModel = await MongoHelper.getCollection('customers');
    return customerModel.find().toArray();
  }
};
