import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const totalPrice = items
    .reduce((sum, item) => {
      const price = item.price * (1 - item.discountPercentage / 100);
      return sum + price * item.quantity;
    }, 0)
    .toFixed(2);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <span className="cart-item-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => {
            const discPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
            const itemTotal = (discPrice * item.quantity).toFixed(2);

            return (
              <div key={item.id} className="cart-item">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <span className="cart-item-category">{item.category}</span>
                  <h3 className="cart-item-title">{item.title}</h3>
                  <div className="cart-item-pricing">
                    <span className="cart-item-price">${discPrice}</span>
                    {item.discountPercentage > 0 && (
                      <span className="cart-item-original">${item.price}</span>
                    )}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item-total">${itemTotal}</span>
                  <button
                    className="btn-remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-rows">
            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>${totalPrice}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          <button className="btn-checkout">
            Proceed to Checkout →
          </button>

          <button
            className="btn-clear-cart"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>

          <Link to="/" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
