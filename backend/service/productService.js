const axios = require('axios');
const Product = require('../models/productModel');
const { getAccessToken } = require('../config/kiotvietAPI');
const config = require('../config/token');

// Đồng bộ tất cả Products
const getAllProductsService = async () => {
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

        const { total, data: products } = response.data;

        // Lưu trữ các sản phẩm vào MongoDB sử dụng Mongoose
        await Product.deleteMany({}); // Xóa tất cả sản phẩm hiện có trong MongoDB
        await Product.insertMany(products); // Lưu trữ lại các sản phẩm mới từ API

        console.log('Đã đồng bộ hóa và lưu trữ sản phẩm thành công.');

        return { total, products }; // Trả về tổng số sản phẩm và danh sách sản phẩm
    } catch (error) {
        console.error('Lỗi khi đồng bộ hóa sản phẩm:', error);
        throw new Error(`Lỗi khi đồng bộ sản phẩm từ KiotViet API: ${error.message}`);
    }
};

// Đồng bộ Product theo ID
const getProductServiceById = async (id) => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.get(`https://publicfnb.kiotapi.com/products/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            }
        });

        const product = response.data;

        await Product.updateOne({ id: product.id }, product, { upsert: true });

        console.log(`Đã cập nhật sản phẩm với ID ${id} vào MongoDB.`);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm theo ID:', error);
    }
};

// Đồng bộ Product theo Code
const getProductServiceByCode = async (code) => {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.get(`https://publicfnb.kiotapi.com/products/code/${code}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Retailer: config.storeName,
            }
        });

        const product = response.data;

        await Product.updateOne({ code: product.code }, product, { upsert: true });

        console.log(`Đã cập nhật sản phẩm với Code ${code} vào MongoDB.`);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm theo Code:', error);
    }
};
module.exports = { 
    getAllProductsService, 
    getProductServiceById, 
    getProductServiceByCode 
};
