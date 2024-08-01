const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceBookSchema = new Schema({
  priceBookName: { type: String, required: true },
  productId: {  type: Number, ref: 'Product', required: true },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  price: { type: Number, required: true },
});

const PriceBook = mongoose.model('PriceBook', PriceBookSchema);
module.exports = PriceBook;
