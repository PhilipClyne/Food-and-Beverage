// models/CartItem.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: false },
    productImage: { type: String, required: false },
    formulaId: { type: Schema.Types.ObjectId, ref: 'Formula', default: null },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    toppings: [{ type: Schema.Types.ObjectId, ref: 'Topping' }],
});

module.exports = mongoose.model('CartItem', CartItemSchema);
