const MissingParamError = require('./missing-param-error')

it("should throw MissingParamError", () => {
    function missingParamError() {
      throw new MissingParamError("Error");
    }
    expect(missingParamError).toThrow(MissingParamError);
});

it("should throw MissingParamError message default", () => {
  function missingParamError() {
    throw new MissingParamError();
  }
  expect(missingParamError).toThrow(MissingParamError);
});
