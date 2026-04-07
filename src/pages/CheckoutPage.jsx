import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
    payment: 'card',
  });

  const subtotal = items.reduce((sum, item) => {
    const price = item.price * (1 - item.discountPercentage / 100);
    return sum + price * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1800));
    dispatch(clearCart());
    setLoading(false);
    setOrderPlaced(true);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out.</p>
          <Link to="/" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon-wrap">
            <div className="success-icon">✅</div>
          </div>
          <h1 className="success-title">Order Placed!</h1>
          <p className="success-subtitle">
            Thank you, <strong>{form.fullName || 'there'}</strong>! Your order has been confirmed and will be delivered soon.
          </p>
          <div className="success-details">
            <div className="success-detail-row">
              <span>📦 Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="success-detail-row">
              <span>💳 Total Charged</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="success-detail-row">
              <span>📍 Delivery To</span>
              <span>{form.city || 'Your Address'}</span>
            </div>
          </div>
          <div className="success-actions">
            <Link to="/" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <Link to="/cart" className="checkout-back">← Back to Cart</Link>
        <h1 className="checkout-title">Checkout</h1>
        <span className="checkout-step">Secure Checkout 🔒</span>
      </div>

      <div className="checkout-layout">
        {/* LEFT: Shipping Form */}
        <div className="checkout-form-col">
          <form onSubmit={handleOrder} id="checkout-form">
            {/* Shipping Info */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <span className="section-num">1</span> Shipping Information
              </h2>
              <div className="checkout-fields">
                <div className="field-group full">
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="checkout-input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="field-group full">
                  <label className="field-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="checkout-input"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="field-group full">
                  <label className="field-label">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="checkout-input"
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="checkout-input"
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">ZIP Code</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.zip}
                    onChange={handleChange}
                    className="checkout-input"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <span className="section-num">2</span> Payment Method
              </h2>
              <div className="payment-options">
                {[
                  { id: 'card', icon: '💳', label: 'Credit / Debit Card' },
                  { id: 'paypal', icon: '🅿️', label: 'PayPal' },
                  { id: 'cod', icon: '💵', label: 'Cash on Delivery' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`payment-option ${form.payment === method.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={form.payment === method.id}
                      onChange={handleChange}
                    />
                    <span className="payment-icon">{method.icon}</span>
                    <span className="payment-label">{method.label}</span>
                    {form.payment === method.id && <span className="payment-check">✓</span>}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="checkout-summary-col">
          <div className="checkout-summary-card">
            <h2 className="checkout-section-title" style={{ marginBottom: '1.25rem' }}>
              Order Summary
            </h2>

            {/* Items List */}
            <div className="checkout-items-list">
              {items.map((item) => {
                const discPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
                return (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item-img-wrap">
                      <img src={item.thumbnail} alt={item.title} className="checkout-item-img" />
                      <span className="checkout-item-qty">{item.quantity}</span>
                    </div>
                    <div className="checkout-item-info">
                      <p className="checkout-item-title">{item.title}</p>
                      <p className="checkout-item-cat">{item.category}</p>
                    </div>
                    <span className="checkout-item-price">
                      ${(discPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div className="checkout-totals">
              <div className="total-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE 🎉</span>
              </div>
              <div className="total-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className={`btn-place-order ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Processing...</>
              ) : (
                <>🔒 Place Order — ${total.toFixed(2)}</>
              )}
            </button>

            <p className="checkout-secure-note">
              🛡️ Your payment info is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
