import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./ShoppingPage.css";
import { setCartId, getCartId } from "../utils/localStorage";
import CategoryList from "../components/CategoryList"; // Import CategoryList

const PAGE_SIZE = 6; // 3x2 grid

const ShoppingPage = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Lưu tất cả sản phẩm nhưng không hiển thị
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get the selected category from the URL
    const query = new URLSearchParams(location.search);
    const categoryId = query.get("category");
    setSelectedCategory(categoryId);
  }, [location]);

  useEffect(() => {
    if (selectedCategory !== null) {
      fetchProductsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Fetch all products when the component mounts or when category changes
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/products`);
      setAllProducts(response.data.products || response.data); // Lưu tất cả sản phẩm vào state allProducts
    } catch (error) {
      console.error("Error fetching all products:", error);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const endpoint = categoryId
        ? `${window.location.origin}/api/products/category/${categoryId}`
        : `${window.location.origin}/api/products`;
      const response = await axios.get(endpoint);
      setProducts(response.data.products || response.data); // Cập nhật state products để hiển thị
    } catch (error) {
      console.error("Error fetching products by category:", error);
    }
  };

  const handleImageClick = (product) => {
    setSelectedProducts((prevSelected) => ({
      ...prevSelected,
      [product.id]: {
        ...product,
        quantity: prevSelected[product.id]
          ? prevSelected[product.id].quantity
          : 1,
        selected: !prevSelected[product.id]?.selected,
      },
    }));
  };

  const handleDescriptionClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleQuantityChange = (productId, change) => {
    setSelectedProducts((prevSelected) => ({
      ...prevSelected,
      [productId]: {
        ...prevSelected[productId],
        quantity: Math.max(
          1,
          (prevSelected[productId]?.quantity || 1) + change
        ),
      },
    }));
  };

  const handleContinueOrdering = async () => {
    let cartId = getCartId();

    if (!cartId) {
      try {
        const cartResponse = await axios.post(
          `${window.location.origin}/api/carts`
        );
        cartId = cartResponse.data._id;
        if (cartId) {
          setCartId(cartId);
          console.log("New cartId created:", cartId);
        } else {
          console.error("Failed to create a new cart");
          return;
        }
      } catch (error) {
        console.error("Error creating cart:", error);
        return;
      }
    }

    const productsToAdd = Object.values(selectedProducts).filter(
      (product) => product.selected
    );
    const items = productsToAdd.map((product) => ({
      productId: product.id,
      formulaId: null,
      quantity: product.quantity,
      price: product.basePrice,
      toppings: product.toppings || [],
      note: product.note || "",
    }));

    try {
      await axios.post(`${window.location.origin}/api/carts/${cartId}/items`, {
        items,
      });
      setSelectedProducts({});
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleComplete = async () => {
    await handleContinueOrdering();
    window.location.href = "/cart";
  };

  const handleGoToCart = async () => {
    let cartId = getCartId();

    if (!cartId) {
      try {
        const cartResponse = await axios.post(
          `${window.location.origin}/api/carts`
        );
        cartId = cartResponse.data._id;
        if (cartId) {
          setCartId(cartId);
          console.log("New cartId created:", cartId);
        } else {
          console.error("Failed to create a new cart");
          return;
        }
      } catch (error) {
        console.error("Error creating cart:", error);
        return;
      }
    }

    navigate("/cart");
  };

  const renderProduct = (product) => {
    const selectedProduct = selectedProducts[product.id];
    const isSelected = selectedProduct?.selected;

    return (
      <div
        key={product.id}
        className={`product-card ${isSelected ? "selected" : ""}`}
        onClick={() => handleImageClick(product)}
      >
        <img
          src={
            product.images.length > 0 ? product.images[0] : "default-image.png"
          }
          alt={product.name}
          className="product-image"
        />
        <h3>{product.fullName}</h3>
        <p>{product.basePrice} VND</p>
        <div className="quantity-controls">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(product.id, -1);
            }}
          >
            -
          </button>
          <span>{selectedProduct?.quantity || 1}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(product.id, 1);
            }}
          >
            +
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDescriptionClick(product);
          }}
          className="desc-btn"
        >
          Mô tả
        </button>
      </div>
    );
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="shopping-page">
      <div className="shopping-page-content">
        <CategoryList
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="product-section">
          <h1>Shopping Page</h1>
          <div className="product-grid">
            {currentProducts.map(renderProduct)}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="previous"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={endIndex >= products.length}
              className="next"
            >
              Next
            </button>
          </div>
          <div className="actions">
            <button onClick={handleContinueOrdering}>Tiếp tục gọi món</button>
            <button onClick={handleComplete}>Hoàn tất</button>
            <button onClick={handleGoToCart}>Giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingPage;
