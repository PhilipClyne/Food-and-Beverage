const axios = require("axios");
const config = require("../config/token");
const { getAccessToken } = require("../config/kiotvietAPI");
const Customer = require('../models/customerModel');

// Đồng bộ tất cả khách hàng
const getAllCustomersService = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get('https://publicfnb.kiotapi.com/customers', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            },
            params: {
                pageSize: 100,
                orderDirection: 'Asc',
            },
        });

        const { total, data: customers } = response.data;
        
        await Customer.deleteMany({});
        await Customer.insertMany(customers);

        console.log("Đồng bộ và lưu trữ khách hàng thành công.");

        return { total, customers };

    } catch (error) {
        console.error("Lỗi khi đồng bộ khách hàng", error);
        throw new Error(`Lỗi khi đồng bộ khách hàng từ KiotViet API: ${error.message}`);
    }
};

// Đồng bộ khách hàng theo ID
const syncCustomerById = async (customerId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(`https://publicfnb.kiotapi.com/customers/${customerId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            }
        });

        const customerData = response.data;

        await Customer.findOneAndUpdate({ id: customerId }, customerData, { upsert: true });

        console.log(`Đồng bộ và lưu trữ khách hàng có ID ${customerId} thành công.`);

        return customerData;

    } catch (error) {
        console.error(`Lỗi khi đồng bộ khách hàng bằng ID ${customerId}`, error);
        throw new Error(`Lỗi khi đồng bộ khách hàng bằng ID từ KiotViet API: ${error.message}`);
    }
};

// Đồng bộ khách hàng theo Code
const syncCustomerByCode = async (customerCode) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(`https://publicfnb.kiotapi.com/customers/code/${customerCode}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            }
        });

        const customerData = response.data;

        await Customer.findOneAndUpdate({ code: customerCode }, customerData, { upsert: true });

        console.log(`Đồng bộ và lưu trữ khách hàng có code ${customerCode} thành công.`);

        return customerData;

    } catch (error) {
        console.error(`Lỗi khi đồng bộ khách hàng bằng code ${customerCode}`, error);
        throw new Error(`Lỗi khi đồng bộ khách hàng bằng code từ KiotViet API: ${error.message}`);
    }
};

// Thêm mới khách hàng
const createCustomerService = async (customerData) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.post('https://publicfnb.kiotapi.com/customers', customerData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
                'Content-Type': 'application/json',
            },
        });

        const newCustomer = response.data.data;

        await Customer.create(newCustomer);

        console.log(`Thêm mới khách hàng thành công: ${newCustomer.name}`);

        return newCustomer;

    } catch (error) {
        console.error("Lỗi khi thêm mới khách hàng", error);
        throw new Error(`Lỗi khi thêm mới khách hàng từ KiotViet API: ${error.message}`);
    }
};

// Cập nhật khách hàng theo ID
const updateCustomerServiceById = async (customerId, updatedCustomerData) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.put(`https://publicfnb.kiotapi.com/customers/${customerId}`, updatedCustomerData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
                'Content-Type': 'application/json',
            },
        });

        const updatedCustomer = response.data;

        await Customer.findOneAndUpdate({ id: customerId }, updatedCustomer, { new: true, upsert: true });

        console.log(`Cập nhật khách hàng có ID ${customerId} thành công.`);

        return updatedCustomer;

    } catch (error) {
        console.error(`Lỗi khi cập nhật khách hàng có ID ${customerId}`, error);
        throw new Error(`Lỗi khi cập nhật khách hàng có ID từ KiotViet API: ${error.message}`);
    }
};

// Xóa khách hàng từ KiotViet API và MongoDB
const deleteCustomerServiceById = async (customerId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.delete(`https://publicfnb.kiotapi.com/customers/${customerId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            }
        });

        if (response.status === 200) {
            await Customer.findOneAndDelete({ id: customerId });
            console.log(`Đã xóa khách hàng có ID ${customerId} thành công.`);
            return { message: "Xóa dữ liệu thành công" };
        } else {
            throw new Error(`Lỗi khi xóa khách hàng từ KiotViet API: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Lỗi khi xóa khách hàng có ID ${customerId}`, error);
        throw new Error(`Lỗi khi xóa khách hàng từ KiotViet API: ${error.message}`);
    }
};

module.exports = {
    getAllCustomersService,
    syncCustomerById,
    syncCustomerByCode,
    createCustomerService,
    updateCustomerServiceById,
    deleteCustomerServiceById
};
