const express = require('express');
const {
    getProducts,
    getProductById,
    getProductByCode,
    getProductsByCategory,
    getProductsByMenuType,
} = require('../controllers/productController');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/code/:code', getProductByCode);
router.get('/category/:categoryId', getProductsByCategory)
router.get('/menuType/:menuType', getProductsByMenuType);

module.exports = router;
