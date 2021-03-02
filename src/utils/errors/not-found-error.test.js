const NotFoundError = require('./not-found-error')

it("should throw NotFoundError", () => {
    function notFoundError() {
      throw new NotFoundError("my error subclass");
    }
    expect(notFoundError).toThrow(NotFoundError);
});

it("should throw NotFoundError message default", () => {
  function notFoundError() {
    throw new NotFoundError();
  }
  expect(notFoundError).toThrow(NotFoundError);
});
