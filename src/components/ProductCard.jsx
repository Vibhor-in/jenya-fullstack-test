import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const discountedPrice = (
    product.price * (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const stars = Math.round(product.rating);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        {product.discountPercentage > 0 && (
          <span className="discount-badge">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          <span className="rating-count">({product.rating})</span>
        </div>

        <div className="product-pricing">
          <span className="price-current">${discountedPrice}</span>
          {product.discountPercentage > 0 && (
            <span className="price-original">${product.price}</span>
          )}
        </div>

        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="in-stock">✓ In Stock ({product.stock})</span>
          ) : (
            <span className="out-of-stock">✗ Out of Stock</span>
          )}
        </div>

        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <span>🛒</span> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
