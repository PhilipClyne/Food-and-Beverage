import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCartId, setCartId } from "../utils/localStorage";
import "./ProductDetail.css"; // Import the CSS file

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      const response = await axios.get(
        `${window.location.origin}/api/products/${id}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  const handleAddToCart = async () => {
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

    const item = {
      productId: product.id,
      quantity,
      price: product.basePrice,
      // Add other necessary fields such as toppings or notes if applicable
    };

    try {
      await axios.post(`${window.location.origin}/api/carts/${cartId}/items`, {
        items: [item],
      });
      console.log("Item added to cart:", item);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <h2>{product.fullName}</h2>
      <img
        src={
          product.images.length > 0 ? product.images[0] : "default-image.png"
        }
        alt={product.fullName}
        className="product-detail-image"
      />
      <p>{product.description}</p>
      <p>Price: {product.basePrice} VND</p>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(-1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(1)}>+</button>
      </div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <Link to="/shopping">
        <button>Back</button>
      </Link>
    </div>
  );
};

export default ProductDetail;
