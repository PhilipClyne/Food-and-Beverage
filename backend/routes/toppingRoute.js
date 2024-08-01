const express = require('express');
const router = express.Router();
const {
    getAllToppings,
    getToppingById,
    getToppingsByCategory,
} = require('../controllers/toppingController');

// Get all toppings
router.get('/', getAllToppings);

// Get a specific topping
router.get('/:id', getToppingById);

router.get('/category/:categoryId', getToppingsByCategory)


module.exports = router;
