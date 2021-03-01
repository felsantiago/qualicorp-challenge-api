const { ObjectId } = require('mongodb');

const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');

module.exports = class DeleteCustomerByIdRepository {
  async delete({ id }) {
    if (!id) {
      throw new MissingParamError('id');
    }

    const customerModel = await MongoHelper.getCollection('customers');
    const customer = await customerModel.deleteOne({ _id: new ObjectId(id) });

    return customer.result;
  }
};
