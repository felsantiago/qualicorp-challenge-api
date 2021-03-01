const { ObjectId } = require('mongodb');

const {
  MissingParamError,
  InvalidParamError,
} = require('../../utils/errors/index');
const MongoHelper = require('../helpers/mongo-helper');

module.exports = class LoadCustomerByIdRepository {
  async load({ id }) {
    if (!id) {
      throw new MissingParamError('id');
    }

    if (!ObjectId.isValid(id)) {
      throw new InvalidParamError('id');
    }

    const customerModel = await MongoHelper.getCollection('customers');
    const customer = await customerModel.findOne({ _id: new ObjectId(id) });

    return customer;
  }
};
