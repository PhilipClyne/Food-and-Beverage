const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
    productId: { type: Number, required: true }, // KiotViet product ID
    productImage: { type: String, required: false },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

module.exports = mongoose.model('OrderDetail', OrderDetailSchema);
