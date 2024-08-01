const Customer = require('../models/customerModel');
const customerService = require('../service/customerService');

// Lấy tất cả khách hàng
const getCustomers = async (req, res) => {
    try {
        const { total, customers } = await customerService.getAllCustomersService();
        res.status(200).json({ total, customers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
    const customerId = req.params.id;
    try {
        const customer = await customerService.syncCustomerById(customerId);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy khách hàng theo Code
const getCustomerByCode = async (req, res) => {
    const customerCode = req.params.code;
    try {
        const customer = await customerService.syncCustomerByCode(customerCode);
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Thêm mới khách hàng
const createCustomer = async (req, res) => {
    const customerData = req.body;
    try {
        const newCustomer = await customerService.createCustomerService(customerData);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật khách hàng theo ID
const updateCustomerById = async (req, res) => {
    const customerId = req.params.id;
    const updatedCustomerData = req.body;
    try {
        const updatedCustomer = await customerService.updateCustomerServiceById(customerId, updatedCustomerData);
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa khách hàng theo ID
const deleteCustomerById = async (req, res) => {
    const customerId = req.params.id;
    try {
        const result = await customerService.deleteCustomerServiceById(customerId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getCustomers,
    getCustomerById,
    getCustomerByCode,
    createCustomer,
    updateCustomerById,
    deleteCustomerById
};
