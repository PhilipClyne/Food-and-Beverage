const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    purchaseDate: { type: Date, default: Date.now },
    soldById: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User', },
    orderDetails: [{ type: Schema.Types.ObjectId, ref: 'OrderDetail' }],
    status: { type: Number, required: true, default: 1 },
    statusValue: { type: String, required: false, default: 'chưa xác nhận' },
    totalQuantity: { type: Number, required: true },
    total: { type: Number, required: true },
    historyNote: { type: String, default: '' },
    orderComplete: { type: Number, required: false },
});

module.exports = mongoose.model('Order', OrderSchema);
