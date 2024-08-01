const axios = require('axios');
const Topping = require('../models/toppingModel');
const { getAccessToken } = require('../config/kiotvietAPI');
const config = require('../config/token');

const getAllToppingService = async () => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.get('https://publicfnb.kiotapi.com/products', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            },
            params: {
                pageSize: 100,
                orderDirection: 'Asc'
            }
        });

        const { data: products } = response.data;

        // Xóa tất cả topping hiện có trong MongoDB
        await Topping.deleteMany({});

        // Trích xuất và lưu trữ các topping
        const toppings = [];
        products.forEach(product => {
            if (product.toppings && product.toppings.length > 0) {
                product.toppings.forEach(topping => {
                    toppings.push({
                        ...topping,
                        productId: product.id
                    });
                });
            }
        });

        if (toppings.length > 0) {
            await Topping.insertMany(toppings);
        }

        const total = toppings.length;

        console.log('Đã đồng bộ hóa và lưu trữ toppings thành công.');

        return { total, toppings };
    } catch (error) {
        console.error('Lỗi khi đồng bộ hóa toppings:', error);
        throw new Error(`Lỗi khi đồng bộ toppings từ KiotViet API: ${error.message}`);
    }
};

module.exports = { getAllToppingService };
