const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const Product = require('../models/productModel');

const createCart = async (req, res) => {
    try {
        const newCart = new Cart();
        const cart = await newCart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error creating cart', error });
    }
};

const addItemToCart = async (req, res) => {
    const cartId = req.params.cartId;
    const { items } = req.body;

    try {
        let cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        for (const item of items) {
            const product = await Product.findOne({ id: item.productId });  // Find product by KiotViet id
            if (!product) {
                return res.status(404).json({ message: `Product with id ${item.productId} not found` });
            }

            const existingItem = cart.items.find(i => i.productId === item.productId);

            if (existingItem) {
                existingItem.quantity += item.quantity;
                await existingItem.save();
            } else {
                const newItem = new CartItem({
                    ...item,
                    productId: item.productId,
                    productName: product.fullName,
                    productImage: product.images[0] // Assuming product.images is an array and we take the first image
                });
                await newItem.save();
                cart.items.push(newItem);
            }
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};

const getCart = async (req, res) => {
    const cartId = req.params.cartId;

    try {
        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Fetch product details for each cart item
        const itemsWithProductDetails = await Promise.all(cart.items.map(async (item) => {
            const product = await Product.findOne({ id: item.productId });  // Assuming 'id' is the KiotViet product ID
            return {
                ...item.toObject(),
                productName: product.fullName,
                productImage: product.images[0], // Assuming product.images is an array and we take the first image
            };
        }));

        const cartWithProductDetails = {
            ...cart.toObject(),
            items: itemsWithProductDetails,
        };

        res.status(200).json(cartWithProductDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

const updateCartItem = async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId; // KiotViet product ID
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(i => i.productId === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        item.quantity = quantity;
        await item.save();

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

const removeItemFromCart = async (req, res) => {
    const cartId = req.params.cartId;
    const itemId = req.params.itemId; // MongoDB ObjectId of CartItem

    try {
        console.log(`Removing item with ID: ${itemId} from cart with ID: ${cartId}`);

        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            console.log('Cart not found');
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(i => i._id.equals(itemId));
        if (itemIndex === -1) {
            console.log('Item not found');
            return res.status(404).json({ message: 'Item not found' });
        }

        const item = cart.items[itemIndex];
        cart.items.splice(itemIndex, 1);
        await CartItem.findByIdAndDelete(itemId);

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();

        console.log('Item removed successfully');
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};

const clearCart = async (req, res) => {
    const cartId = req.params.cartId;

    try {
        console.log(`Clearing items from cart with ID: ${cartId}`);

        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            console.log('Cart not found');
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Xóa tất cả các mục trong giỏ hàng
        for (const item of cart.items) {
            await CartItem.findByIdAndDelete(item._id);
        }

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        // Không xóa giỏ hàng tại đây, chỉ xóa các mục

        console.log('Cart items cleared successfully');
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};

const deleteCartIfEmpty = async (req, res) => {
    const cartId = req.params.cartId;

    try {
        console.log(`Checking if cart with ID: ${cartId} is empty`);

        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            console.log('Cart not found');
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (cart.items.length === 0) {
            await Cart.findByIdAndDelete(cartId);
            console.log('Cart deleted successfully');
        }

        res.status(200).json({ message: 'Cart checked and deleted if empty' });
    } catch (error) {
        console.error('Error deleting empty cart:', error);
        res.status(500).json({ message: 'Error deleting empty cart', error });
    }
};

module.exports = {
    createCart,
    addItemToCart,
    getCart,
    updateCartItem,
    removeItemFromCart,
    clearCart,
    deleteCartIfEmpty,
};
