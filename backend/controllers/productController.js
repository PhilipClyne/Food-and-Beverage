const Product = require('../models/productModel');
const Attribute = require('../models/attributeModel');
const Unit = require('../models/unitModel');
const Inventory = require('../models/inventoryModel');
const PriceBook = require('../models/pricebookModel');
const Topping = require('../models/toppingModel');
const Formula = require('../models/formulaModel');
const Category = require('../models/categoryModel');
const productService = require('../service/productService');

const getProducts = async (req, res) => {
    try {
        const { total } = await productService.getAllProductsService(); // Đồng bộ sản phẩm và lấy tổng số sản phẩm từ API

        const products = await Product.find({});

        res.status(200).json({ total, products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.getProductServiceById(id);
        const product = await Product.findOne({ id });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductByCode = async (req, res) => {
    try {
        const { code } = req.params;
        await productService.getProductServiceByCode(code);
        const product = await Product.findOne({ code });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const product = await Product.find({ categoryId });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error });
    }
};

const getProductsByMenuType = async (req, res) => {
    try {
        const { menuType } = req.params;
        const products = await Product.find({ menuType });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by menu type', error });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductByCode,
    getProductsByCategory,
    getProductsByMenuType,
};
