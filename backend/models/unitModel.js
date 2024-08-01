const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  unit: { type: String, required: true },
  conversionValue: { type: Number, required: true },
  basePrice: { type: Number, required: true },
});

const Unit = mongoose.model('Unit', UnitSchema);
module.exports = Unit;
