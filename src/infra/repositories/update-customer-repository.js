const { ObjectId } = require('mongodb');

const MissingParamError = require('../../utils/errors/missing-param-error');
const MongoHelper = require('../helpers/mongo-helper');

module.exports = class UpdateCustomerRepository {
  async update(id, data) {
    if (!id) {
      throw new MissingParamError('id');
    }

    if (!data) {
      throw new MissingParamError('data');
    }

    const customerModel = await MongoHelper.getCollection('customers');
    await customerModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
        },
      }
    );

    return data;
  }
};
