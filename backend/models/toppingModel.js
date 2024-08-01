const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ToppingSchema = new Schema({
  retailerId: { type: Number, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  categoryId: { type: Number, ref: 'Category', required: true },
  basePrice: { type: Number, required: true },
});

const Topping = mongoose.model('Topping', ToppingSchema);
module.exports = Topping;

