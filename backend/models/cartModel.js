// models/Cart.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    items: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }],
    totalPrice: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);
