import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./CategoryManagement.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]); // Ensure this is initialized as an array
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState("product"); // 'product' or 'menuType'
  const [selectedCategoriesForMenuType, setSelectedCategoriesForMenuType] =
    useState([]);
  const [expandedMenuTypes, setExpandedMenuTypes] = useState(
    new Set(["Đồ ăn", "Đồ uống", "Khác"])
  ); // All menu types expanded by default
  const productDetailRef = useRef();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        await fetchAllProducts(); // Fetch products first
        await fetchCategories(); // Then fetch categories
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productDetailRef.current &&
        !productDetailRef.current.contains(event.target)
      ) {
        setSelectedProduct(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/products`);
      if (Array.isArray(response.data)) { // Ensure response.data is an array
        setProducts(response.data); // Store all products
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategoriesForMenuType((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const assignMenuType = async (menuType) => {
    try {
      const response = await axios.post(
        `${window.location.origin}/api/categories/assign-menu-type`,
        {
          categoryIds: selectedCategoriesForMenuType,
          menuType,
        }
      );
      if (response.status === 200) {
        alert(`Nhóm hàng đã được phân vào mục ${menuType} thành công`);
        setSelectedCategoriesForMenuType([]); // Deselect categories after assignment
        fetchCategories(); // Refresh categories to update view
      }
    } catch (error) {
      console.error("Lỗi khi phân nhóm hàng vào mục:", error);
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const response = await axios.get(
        `${window.location.origin}/api/products/category/${categoryId}`
      );
      if (Array.isArray(response.data)) { // Ensure response.data is an array
        setProducts(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleViewDetail = (item) => {
    setSelectedProduct(item === selectedProduct ? null : item);
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

  return (
    <div className="category-management">
      <div className="header-buttons">
        <button onClick={() => setView("product")}>Product</button>
        <button onClick={() => setView("menuType")}>Menu Type</button>
      </div>
      <div className="main-content">
        {view === "product" ? (
          <div className="categories-list">
            <h2>Categories</h2>
            <ul>
              {["Đồ ăn", "Đồ uống", "Khác"].map((menuType) => (
                <div key={menuType}>
                  <h3
                    onClick={() => handleMenuTypeToggle(menuType)}
                    className={`menu-type-header ${
                      expandedMenuTypes.has(menuType) ? "expanded" : ""
                    }`}
                  >
                    {menuType} ({groupedCategories[menuType].length})
                    <span className="expand-toggle">
                      {expandedMenuTypes.has(menuType) ? "▲" : "▼"}
                    </span>
                  </h3>
                  {expandedMenuTypes.has(menuType) && (
                    <ul>
                      {groupedCategories[menuType].map((category) => (
                        <li
                          key={category.categoryId}
                          onClick={() =>
                            handleCategoryClick(category.categoryId)
                          }
                          className={
                            selectedCategory === category.categoryId
                              ? "active"
                              : ""
                          }
                        >
                          {category.categoryName} ({category.productsCount})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <div className="menu-type-list">
            <h2>Select Categories for Menu Type</h2>
            {["Đồ ăn", "Đồ uống", "Khác"].map((menuType) => (
              <div key={menuType}>
                <h3
                  onClick={() => handleMenuTypeToggle(menuType)}
                  className={`menu-type-header ${
                    expandedMenuTypes.has(menuType) ? "expanded" : ""
                  }`}
                >
                  {menuType} ({groupedCategories[menuType].length})
                  <span className="expand-toggle">
                    {expandedMenuTypes.has(menuType) ? "▲" : "▼"}
                  </span>
                </h3>
                {expandedMenuTypes.has(menuType) && (
                  <div className="category-box">
                    <ul>
                      {groupedCategories[menuType].map((category) => (
                        <li
                          key={category.categoryId}
                          onClick={() =>
                            toggleCategorySelection(category.categoryId)
                          }
                          className={
                            selectedCategoriesForMenuType.includes(
                              category.categoryId
                            )
                              ? "active"
                              : ""
                          }
                        >
                          {category.categoryName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <div className="menu-type-buttons">
              <button onClick={() => assignMenuType("Đồ ăn")}>
                Đăng ký đồ ăn
              </button>
              <button onClick={() => assignMenuType("Đồ uống")}>
                Đăng ký đồ uống
              </button>
              <button onClick={() => assignMenuType("Khác")}>
                Đăng ký khác
              </button>
            </div>
          </div>
        )}
        {view === "product" && (
          <div className="products-list">
            {selectedCategory === null ? (
              <p>Please select a category to view products</p>
            ) : (
              <>
                <h2>Products in Category</h2>
                <div className="products">
                  {products.map((product) => (
                    <div key={product.id} className="product-item">
                      <img src={product.images[0]} alt={product.fullName} />
                      <p>{product.fullName}</p>
                      <p>Price: ${product.basePrice}</p>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetail(product)}
                      >
                        View Detail
                      </button>
                      {selectedProduct === product && (
                        <div
                          className="product-detail"
                          ref={productDetailRef}
                        >
                          <h3>{product.fullName}</h3>
                          <img src={product.images[0]} alt={product.fullName} />
                          <p>{product.description}</p>
                          <p>Price: ${product.basePrice}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;
