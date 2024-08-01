
// utils/localStorage.js
export const getCartId = () => {
  return localStorage.getItem('cartId');
};

export const setCartId = (cartId) => {
  localStorage.setItem('cartId', cartId);
};

export const removeCartId = () => {
  localStorage.removeItem('cartId');
};

