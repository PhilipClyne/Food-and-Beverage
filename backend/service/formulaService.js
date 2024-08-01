const axios = require('axios');
const Formula = require('../models/formulaModel');
const { getAccessToken } = require('../config/kiotvietAPI');
const config = require('../config/token');

const getAllFormulaService = async () => {
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

        // Xóa tất cả công thức hiện có trong MongoDB
        await Formula.deleteMany({});

        // Trích xuất và lưu trữ các công thức
        const formulas = [];
        products.forEach(product => {
            if (product.formulas && product.formulas.length > 0) {
                product.formulas.forEach(formula => {
                    formulas.push({
                        ...formula,
                        productId: product.id
                    });
                });
            }
        });

        if (formulas.length > 0) {
            await Formula.insertMany(formulas);
        }

        const total = formulas.length;

        console.log('Đã đồng bộ hóa và lưu trữ formulas thành công.');

        return { total, formulas };
    } catch (error) {
        console.error('Lỗi khi đồng bộ hóa formulas:', error);
        throw new Error(`Lỗi khi đồng bộ formulas từ KiotViet API: ${error.message}`);
    }
};

module.exports = { getAllFormulaService };
