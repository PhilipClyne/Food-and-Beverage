const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FormulaSchema = new Schema({
  id: { type: Number, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  retailerId: { type: Number, required: true },
  fullName: { type: String, required: true },
  categoryId: { type: Number, ref: 'Category', required: true },
  basePrice: { type: Number, required: true },
  quantity: { type: Number },
});

const Formula = mongoose.model('Formula', FormulaSchema);
module.exports = Formula;

