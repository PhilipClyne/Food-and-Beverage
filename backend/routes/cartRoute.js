// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCart,
    addItemToCart,
    getCart,
    updateCartItem,
    removeItemFromCart,
    clearCart,
    deleteCartIfEmpty,
} = require('../controllers/cartController');

router.post('/', createCart);
router.post('/:cartId/items', addItemToCart);
router.get('/:cartId', getCart);
router.put('/:cartId/items/:productId', updateCartItem); // Update endpoint
router.delete('/:cartId/items/:itemId', removeItemFromCart); // Update endpoint
router.delete('/:cartId', clearCart); // Clear cart endpoint
router.delete('/:cartId/delete-if-empty', deleteCartIfEmpty);
module.exports = router;
