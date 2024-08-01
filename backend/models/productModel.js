const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Attribute = require('./attributeModel')
const Unit = require('./unitModel')
const Inventory = require('./inventoryModel')
const PriceBook = require('./pricebookModel')
const Formula = require('./formulaModel')
const Topping = require('./toppingModel')

const ProductSchema = new Schema({
  id : { type: Number, required: true},
  code: { type: String, required: true },
  retailerId: { type: Number, required: true },
  allowsSale: { type: Boolean, default: true },
  name: { type: String, required: true },
  categoryId: { type: Number, required: true, ref: 'Category' },
  categoryName: { type: String, required: true },
  productType: { type: Number },
  isTopping: { type: Boolean, default: false },
  isProcessedGoods: { type: Boolean, default: false },
  isTimeType: { type: Boolean, default: false },
  fullName: { type: String, required: true },
  description: { type: String },
  orderTemplate: { type: String },
  hasVariants: { type: Boolean, default: false },
  attributes: [Attribute.schema],
  unit: { type: String },
  masterUnitId: { type: Number },
  masterProductId: { type: Number },
  conversionValue: { type: Number },
  units: [Unit.schema],
  images: [{ type: String }], // store image paths
  inventories: [Inventory.schema],
  priceBooks: [PriceBook.schema],
  toppings: [Topping.schema],
  formulas: [Formula.schema],
  basePrice: { type: Number, required: true },
  isTimeServices: { type: Boolean, default: false },
  weight: { type: Number },
  modifiedDate: { type: Date, default: Date.now },
  createdDate: { type: Date, default: Date.now },
  menuType: { type: String, enum: ['đồ ăn', 'đồ uống', 'khác'], default: 'khác' }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
