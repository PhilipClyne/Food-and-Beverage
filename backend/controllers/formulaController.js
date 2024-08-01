const Formula = require('../models/formulaModel');
const Category = require('../models/categoryModel');
const formulaService = require('../service/formulaService');

// Get all formulas
const getAllFormulas = async (req, res) => {
    try {
        const { total } = await formulaService.getAllFormulaService();
        const formulas = await Formula.find();
        res.status(200).json({ total, formulas });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching formulas', error });
    }
};

// Get formulas by category
const getFormulasByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const formulas = await Formula.find({ categoryId });
        res.status(200).json(formulas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching formulas by category', error });
    }
};

const getFormulaById = async (req, res) => {
    try {
        const formula = await Formula.findById(req.params.id);
        if (!formula) {
            return res.status(404).json({ message: 'Formula not found' });
        }
        res.status(200).json(formula);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllFormulas,
    getFormulaById,
    getFormulasByCategory,
};