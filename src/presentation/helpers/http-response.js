const { ServerError } = require('../errors');

module.exports = class HttpResponse {
  static ok(body) {
    return {
      statusCode: 200,
      body,
    };
  }

  static create(body) {
    return {
      statusCode: 201,
      body,
    };
  }

  static badRequest(error) {
    return {
      statusCode: 400,
      body: {
        error: error.message,
      },
    };
  }

  static notFound(error) {
    return {
      statusCode: 404,
      body: {
        error: error.message,
      },
    };
  }

  static serverError() {
    return {
      statusCode: 500,
      body: {
        error: new ServerError().message,
      },
    };
  }
};
