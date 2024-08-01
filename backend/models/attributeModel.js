const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
    productId: { type: Number, ref: 'Product', required: true },
    attributeName: { type: String, required: true },
    attributeValue: { type: String, required: true }
});

const Attribute = mongoose.model('Attribute', AttributeSchema);
module.exports = Attribute;
