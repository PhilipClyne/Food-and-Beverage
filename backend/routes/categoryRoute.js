const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, assignMenuTypeToCategories } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/assign-menu-type', assignMenuTypeToCategories);

module.exports = router;
