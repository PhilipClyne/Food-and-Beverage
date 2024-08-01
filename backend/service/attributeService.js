const axios = require('axios');
const Attribute = require('../models/attributeModel');
const { getAccessToken } = require('../config/kiotvietAPI');
const config = require('../config/token');

const getAllAttributeService = async () => {
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

        // Xóa tất cả thuộc tính hiện có trong MongoDB
        await Attribute.deleteMany({});

        // Trích xuất và lưu trữ các thuộc tính
        const attributes = [];
        products.forEach(product => {
            if (product.attributes && product.attributes.length > 0) {
                product.attributes.forEach(attr => {
                    attributes.push({
                        ...attr,
                        productId: product.id
                    });
                });
            }
        });

        if (attributes.length > 0) {
            await Attribute.insertMany(attributes);
        }

        const total = attributes.length;

        console.log('Đã đồng bộ hóa và lưu trữ attributes thành công.');

        return { total, attributes };
    } catch (error) {
        console.error('Lỗi khi đồng bộ hóa attributes:', error);
        throw new Error(`Lỗi khi đồng bộ attributes từ KiotViet API: ${error.message}`);
    }
};

module.exports = { getAllAttributeService };
