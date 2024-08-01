import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCartId, setCartId, removeCartId } from '../utils/localStorage';
import './CartPage.css';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeCart = async () => {
            let cartId = getCartId();
            if (!cartId) {
                try {
                    const response = await axios.post(`${window.location.origin}/api/carts`);
                    cartId = response.data._id;
                    setCartId(cartId);
                } catch (error) {
                    console.error('Error creating cart:', error);
                    return;
                }
            }
            fetchCart(cartId);
        };

        initializeCart();

        const handleBeforeUnload = async (e) => {
            await clearCartIfEmpty();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearCartIfEmpty();
        };
    }, []);

    const fetchCart = async (cartId) => {
        try {
            const response = await axios.get(`${window.location.origin}/api/carts/${cartId}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleQuantityChange = async (productId, change) => {
        const cartId = getCartId();

        if (change < 1) return;

        try {
            const response = await axios.put(`${window.location.origin}/api/carts/${cartId}/items/${productId}`, { quantity: change });
            setCart(response.data);
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        const cartId = getCartId();

        try {
            const response = await axios.delete(`${window.location.origin}/api/carts/${cartId}/items/${itemId}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleClearCart = async () => {
        const cartId = getCartId();

        try {
            await axios.delete(`${window.location.origin}/api/carts/${cartId}/`);
            setCart({ ...cart, items: [], totalPrice: 0 });
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const clearCartIfEmpty = async () => {
        const cartId = getCartId();

        try {
            const response = await axios.get(`${window.location.origin}/api/carts/${cartId}`);
            if (response.data.items.length === 0) {
                await axios.delete(`${window.location.origin}/api/carts/${cartId}/delete-if-empty`);
                removeCartId();
            }
        } catch (error) {
            console.error('Error clearing cart if empty:', error);
        }
    };

    const handleNavigateToPaymentType = () => {
        if (cart && cart.items.length > 0) {
            navigate('/payment-type');
        } else {
            alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.');
        }
    };

    if (!cart) {
        return <div>Loading...</div>;
    }

    return (
        <div className="cart-page">
            <div className="menu">
                <button onClick={() => navigate('/shopping')}>Menu</button>
            </div>
            <h1>Cart</h1>
            {cart.items.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div className="cart-items-container">
                    {cart.items.map((item, index) => (
                        <div key={item._id} className="cart-item">
                            <h3>{index + 1}. {item.productName}</h3>
                            <img src={item.productImage || 'default-image.png'} alt={item.productName} className="cart-item-image" />
                            <p>Price: {item.price} VND</p>
                            <div className="quantity-controls">
                                <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                            </div>
                            <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
            <div className="cart-total">
                <h2>Total: {cart.totalPrice} VND</h2>
            </div>
            <button onClick={handleClearCart}>Clear Cart</button>
            <button onClick={handleNavigateToPaymentType}>Proceed to Payment</button>
        </div>
    );
};

export default CartPage;
