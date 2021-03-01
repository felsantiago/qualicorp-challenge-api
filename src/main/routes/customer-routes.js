const { adaptRoute } = require('../adapters/express-router-adapter');
const CreateCustomerComposer = require('../composers/create-customer-composer');
const UpdateCustomerComposer = require('../composers/update-customer-composer');
const LoadAllCustomersComposer = require('../composers/load-all-customers-composer');
const LoadCustomerByIdComposer = require('../composers/load-customer-by-id-composer');
const DeleteCustomerByIdComposer = require('../composers/delete-customer-by-id-composer');

module.exports = (router) => {
  router.get('/customers', adaptRoute(LoadAllCustomersComposer.compose()));
  router.get('/customers/:id', adaptRoute(LoadCustomerByIdComposer.compose()));
  router.post('/customers', adaptRoute(CreateCustomerComposer.compose()));
  router.put('/customers/:id', adaptRoute(UpdateCustomerComposer.compose()));
  router.delete(
    '/customers/:id',
    adaptRoute(DeleteCustomerByIdComposer.compose())
  );
};
