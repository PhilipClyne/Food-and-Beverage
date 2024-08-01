const axios = require('axios');
const config = require('../config/token');
const Order = require('../models/orderModel');
const { getAccessToken } = require('../config/kiotvietAPI');

const createOrderService = async (orderData) => {
    try {
        const accessToken = await getAccessToken();        

        console.log('Order Data:', JSON.stringify(orderData, null, 2));

        // Make API request to create order
        const response = await axios.post('https://publicfnb.kiotapi.com/orders', orderData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
                'Content-Type': 'application/json',
            },
        });

        // Assuming the API response contains the created order data
        const createdOrder = response.data;

        // Save the created order to MongoDB
        const savedOrder = await Order.create(createdOrder);

        return savedOrder;

    } catch (error) {
        console.error(`Lỗi khi tạo đơn hàng mới từ KiotViet API: ${error.response.data.errorCode}, ${JSON.stringify(error.response.data)}`);
        throw new Error(`Lỗi khi tạo đơn hàng mới từ KiotViet API (${error.response.data.errorCode}): ${error.response.data.message}`);
    }
};

module.exports = {
    createOrderService,
};
