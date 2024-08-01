const Topping = require('../models/toppingModel');
const Category = require('../models/categoryModel');
const toppingService = require('../service/topppingService')


// Get all toppings
const getAllToppings = async (req, res) => {
    try {
        const { total } = await toppingService.getAllToppingService();
        const toppings = await Topping.find();
        res.status(200).json({ total, toppings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching toppings', error });
    }
};

// Get toppings by category
const getToppingsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const toppings = await Topping.find({ categoryId });
        res.status(200).json(toppings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching toppings by category', error });
    }
};

const getToppingById = async (req, res) => {
    try {
        const topping = await Topping.findById(req.params.id);
        if (!topping) {
            return res.status(404).json({ message: 'Topping not found' });
        }
        res.status(200).json(topping);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllToppings,
    getToppingById,
    getToppingsByCategory,
};