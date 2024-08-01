const axios = require('axios');
const Category = require('../models/categoryModel');
const { getAccessToken } = require('../config/kiotvietAPI');
const config = require('../config/token');

// Hàm để tính toán số cấp của một danh mục
const calculateCategoryDepth = async (category) => {
    let depth = 0;
    let currentCategory = category;

    while (currentCategory.parentId) {
        currentCategory = await Category.findOne({ categoryId: currentCategory.parentId });
        if (!currentCategory) break;
        depth++;
        if (depth > 3) break;
    }

    return depth;
};

// Hàm để đồng bộ tất cả các danh mục từ KiotViet
const getAllCategoriesService = async (pageSize = 100, orderDirection = 'Asc', hierarchicalData = true) => {
    try {
        const accessToken = await getAccessToken();

        const apiUrl = 'https://publicfnb.kiotapi.com/categories';

        const response = await axios.get(apiUrl, {
            headers: {
                Retailer: config.storeName,
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                pageSize,
                orderDirection,
                hierarchicalData
            },
        });

        let kiotVietCategories = response.data.data;

        // Đánh dấu tất cả các danh mục hiện tại là không hoạt động
        await Category.updateMany({}, { isActive: false });

        // Lưu các danh mục từ KiotViet và đánh dấu là hoạt động
        const bulkOps = await Promise.all(kiotVietCategories.map(async (kiotVietCategory) => {
            const depth = await calculateCategoryDepth(kiotVietCategory);
            if (depth > 3) {
                throw new Error('Danh mục vượt quá số cấp cho phép.');
            }

            return {
                updateOne: {
                    filter: { categoryId: kiotVietCategory.categoryId },
                    update: {
                        parentId: kiotVietCategory.parentId,
                        categoryName: kiotVietCategory.categoryName,
                        retailerId: kiotVietCategory.retailerId,
                        hasChild: kiotVietCategory.hasChild,
                        modifiedDate: kiotVietCategory.modifiedDate,
                        createdDate: kiotVietCategory.createdDate,
                        children: kiotVietCategory.children,
                        isActive: true  // Đánh dấu danh mục này là hoạt động
                    },
                    upsert: true,
                },
            };
        }));

        await Category.bulkWrite(bulkOps);

        // Xóa tất cả các danh mục không hoạt động
        await Category.deleteMany({ isActive: false });

        console.log('Categories synchronized successfully');
        return kiotVietCategories;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.responseStatus) {
            console.error('Error synchronizing categories:', error.response.data.responseStatus);
        } else {
            console.error('Error synchronizing categories:', error.message);
        }
        throw error;
    }
};

// Hàm để đồng bộ lấy chi tiết 1 danh mục
const getCategoryDetailsService = async (categoryId) => {
    try {
        // Tìm kiếm danh mục trong MongoDB trước
        const existingCategory = await Category.findOne({ categoryId });

        if (existingCategory) {
            console.log('Fetching category details from MongoDB...');
            return existingCategory;
        }

        console.log('Category not found in MongoDB. Fetching from KiotViet API...');
        const accessToken = await getAccessToken();
        const apiUrl = `https://publicfnb.kiotapi.com/categories/${categoryId}`;

        const response = await axios.get(apiUrl, {
            headers: {
                Retailer: config.storeName,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const kiotVietCategory = response.data;

        // Tạo mới category nếu không tìm thấy trong MongoDB
        const category = new Category({
            categoryId: kiotVietCategory.categoryId,
            parentId: kiotVietCategory.parentId,
            categoryName: kiotVietCategory.categoryName,
            retailerId: kiotVietCategory.retailerId,
            hasChild: kiotVietCategory.hasChild,
            modifiedDate: kiotVietCategory.modifiedDate,
            createdDate: kiotVietCategory.createdDate,
            children: kiotVietCategory.children,
        });

        await category.save();

        console.log('Category details synchronized successfully');
        return category;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.responseStatus) {
            console.error('Error synchronizing category details:', error.response.data.responseStatus);
        } else {
            console.error('Error synchronizing category details:', error.message);
        }
        throw error;
    }
};

// Hàm để xóa danh mục và kiểm tra điều kiện xóa
const deleteCategory = async (categoryId) => {
    try {
        const category = await Category.findOne({ categoryId });

        if (!category) {
            throw new Error('Danh mục không tồn tại');
        }

        if (category.hasChild || category.children.length > 0) {
            throw new Error('Không thể xóa danh mục cha nếu đang có chứa danh mục con');
        }

        const categoryInUse = await checkCategoryInUse(categoryId);
        if (categoryInUse) {
            throw new Error('Không thể xóa danh mục con nếu đang được sử dụng');
        }

        await Category.deleteOne({ categoryId });
        console.log('Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error.message);
        throw error;
    }
};

// Hàm để kiểm tra xem danh mục có đang được sử dụng hay không
const checkCategoryInUse = async (categoryId) => {
    // Ví dụ: kiểm tra trong cơ sở dữ liệu sản phẩm để xem có sản phẩm nào đang sử dụng danh mục này hay không
    // Trả về true nếu đang được sử dụng, ngược lại false
S
    return false; // Cập nhật logic kiểm tra ở đây
};

module.exports = {
    getAllCategoriesService,
    getCategoryDetailsService,
    deleteCategory,
};
