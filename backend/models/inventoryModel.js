const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  productId: { type: Number, ref: 'Product', required: true  },
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  branchId: { type: Number, default: 2},
  branchName: { type: String, default: 'chi nhánh 2' },
  onHand: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 }
});

const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;
