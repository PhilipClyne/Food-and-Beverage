const express = require('express');
const router = express.Router();
const {
    getAllFormulas,
    getFormulaById,
    getFormulasByCategory,
} = require('../controllers/formulaController');

// Get all formulas
router.get('/', getAllFormulas);

// Get a specific formula
router.get('/:id', getFormulaById);

router.get('/category/:categoryId', getFormulasByCategory)


module.exports = router;
