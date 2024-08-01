const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Formula = require('../models/formulaModel');
const Topping = require('../models/toppingModel');
const { getAllCategoriesService, getCategoryDetailsService } = require('../service/categoryService')

// Lấy tất cả categories
const getCategories = async (req, res) => {
    try {
        // Get the menuType from query parameters
        const { menuType } = req.query;

        // Sync data from KiotViet
        await getAllCategoriesService();

        // Prepare query based on menuType
        const query = menuType ? { menuType } : {};

        // Get categories from MongoDB with optional menuType filter
        const categories = await Category.find(query);

        // Calculate the number of products in each category
        const categoriesWithProductCount = await Promise.all(
            categories.map(async (category) => {
                const productCount = await Product.countDocuments({ categoryId: category.categoryId });
                return {
                    ...category.toObject(),
                    productsCount: productCount,
                };
            })
        );

        res.status(200).json(categoriesWithProductCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Lấy chi tiết một category bằng ID
const getCategoryById = async (req, res) => {
    try {
        // Tìm kiếm danh mục trong MongoDB trước
        let category = await Category.findOne({ categoryId: req.params.id });

        // Nếu không tìm thấy trong MongoDB, gọi KiotViet API
        if (!category) {
            console.log('Category not found in MongoDB. Fetching from KiotViet API...');
            const kiotVietCategory = await getCategoryDetailsService(req.params.id);

            // Tạo một đối tượng danh mục mới từ dữ liệu của KiotViet API
            category = new Category({
                categoryId: kiotVietCategory.categoryId,
                parentId: kiotVietCategory.parentId,
                categoryName: kiotVietCategory.categoryName,
                retailerId: kiotVietCategory.retailerId,
                hasChild: kiotVietCategory.hasChild,
                modifiedDate: kiotVietCategory.modifiedDate,
                createdDate: kiotVietCategory.createdDate,
                children: kiotVietCategory.children,
            });

            // Lưu danh mục mới vào MongoDB
            await category.save();
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignMenuTypeToCategories = async (req, res) => {
    try {
        const { categoryIds, menuType } = req.body;
        await Category.updateMany(
            { categoryId: { $in: categoryIds } },
            { menuType }
        );
        res.status(200).json({ message: 'Categories updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    assignMenuTypeToCategories,
};
