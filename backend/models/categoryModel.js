const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryId: { type: Number, required: true, unique: true },
    parentId: { type: Number },
    categoryName: { type: String, required: true },
    retailerId: { type: Number, required: true },
    hasChild: { type: Boolean },
    modifiedDate: { type: Date },
    createdDate: { type: Date, default: Date.now },
    children: { type: Array, default: [] },
    menuType: { type: String, default: "khác" },
    isActive: { type: Boolean, default: true },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
