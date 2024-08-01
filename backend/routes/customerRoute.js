const express = require("express");
const router = express.Router();
const { getCustomers, getCustomerById, getCustomerByCode, createCustomer, updateCustomerById, deleteCustomerById } = require('../controllers/customerController')

router.get("/", getCustomers);
router.get('/:id', getCustomerById);
router.get('/code/:code', getCustomerByCode);
router.post('/', createCustomer);
router.put('/:id', updateCustomerById);
router.delete("/:id", deleteCustomerById);

module.exports = router;
