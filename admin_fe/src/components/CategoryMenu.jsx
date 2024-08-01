import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CategoryMenu.css";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/shopping?category=${categoryId}`);
  };

  const groupedCategories = {
    "Đồ ăn": [],
    "Đồ uống": [],
    Khác: [],
  };

  categories.forEach((category) => {
    if (category.menuType in groupedCategories) {
      groupedCategories[category.menuType].push(category);
    } else {
      groupedCategories.Khác.push(category);
    }
  });

  const displayCategories = ["Đồ ăn", "Đồ uống", "Khác"];

  return (
    <div className="category-menu">
      <h2>Category Menu</h2>
      {displayCategories.map((menuType) => (
        <div key={menuType} className="menu-type-section">
          <h3 className="menu-type-header">{menuType}</h3>
          <div className="category-grid">
            {groupedCategories[menuType].map((category) => (
              <button
                key={category.categoryId}
                className="category-button"
                onClick={() => handleCategoryClick(category.categoryId)}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryMenu;
