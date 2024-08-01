// components/CategoryList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryList.css';

const CategoryList = ({ selectedCategory, setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [expandedMenuTypes, setExpandedMenuTypes] = useState(new Set(['Food', 'Drink', 'Khác']));

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Ensure that CategoryList updates when selectedCategory changes
        if (selectedCategory) {
            // Optional: Additional logic if needed when selectedCategory changes
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${window.location.origin}/api/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleMenuTypeToggle = (menuType) => {
        setExpandedMenuTypes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(menuType)) {
                newSet.delete(menuType);
            } else {
                newSet.add(menuType);
            }
            return newSet;
        });
    };

    const groupedCategories = {
        'Đồ ăn': [],
        'Đồ uống': [],
        'Khác': []
    };

    categories.forEach((category) => {
        if (category.menuType in groupedCategories) {
            groupedCategories[category.menuType].push(category);
        } else {
            groupedCategories.Khác.push(category);
        }
    });

    const displayCategories = ['Đồ ăn', 'Đồ uống', 'Khác'];

    return (
        <div className="category-list">
            <div className="categories">
                <h2>Categories</h2>
                <ul>
                    {displayCategories.map((menuType) => (
                        <div key={menuType}>
                            <h3
                                onClick={() => handleMenuTypeToggle(menuType)}
                                className={`menu-type-header ${expandedMenuTypes.has(menuType) ? 'expanded' : ''
                                    }`}
                            >
                                {menuType} ({groupedCategories[menuType].length})
                                <span className="expand-toggle">
                                    {expandedMenuTypes.has(menuType) ? '▲' : '▼'}
                                </span>
                            </h3>
                            {expandedMenuTypes.has(menuType) && (
                                <ul>
                                    {groupedCategories[menuType].map((category) => (
                                        <li
                                            key={category.categoryId}
                                            onClick={() => handleCategoryClick(category.categoryId)}
                                            className={selectedCategory === category.categoryId ? 'selected' : ''}
                                        >
                                            {category.categoryName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CategoryList;
