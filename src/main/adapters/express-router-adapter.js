module.exports = class ExpressRouterAdapter {
  static adaptRoute(router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
      };
      const httpResponse = await router.route(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
};
