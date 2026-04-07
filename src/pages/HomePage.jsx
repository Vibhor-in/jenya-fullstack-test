import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchCategories,
  setCategory,
  setPage,
} from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    items,
    total,
    categories,
    selectedCategory,
    currentPage,
    itemsPerPage,
    loading,
    categoriesLoading,
    error,
  } = useSelector((state) => state.products);

  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: itemsPerPage, skip, category: selectedCategory }));
  }, [dispatch, selectedCategory, currentPage, skip, itemsPerPage]);

  const handleCategoryChange = (cat) => {
    dispatch(setCategory(cat));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover <span className="gradient-text">Amazing</span> Products
          </h1>
          <p className="hero-subtitle">
            Shop from thousands of premium products across all categories
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">{total}+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat">
            <span className="stat-number">{categories.length}+</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Secure</span>
          </div>
        </div>
      </div>

      <div className="home-content">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Categories</h2>
          </div>

          {categoriesLoading ? (
            <div className="categories-skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-item"></div>
              ))}
            </div>
          ) : (
            <ul className="category-list">
              <li>
                <button
                  className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  <span className="cat-icon">🌐</span> All Products
                  <span className="cat-count">{total}</span>
                </button>
              </li>
              {categories.map((cat) => (
                <li key={typeof cat === 'string' ? cat : cat.slug}>
                  <button
                    className={`category-btn ${
                      selectedCategory === (typeof cat === 'string' ? cat : cat.slug)
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      handleCategoryChange(typeof cat === 'string' ? cat : cat.slug)
                    }
                  >
                    <span className="cat-icon">📦</span>
                    {typeof cat === 'string' ? cat : cat.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="products-area">
          <div className="products-header">
            <div className="products-info">
              <h2 className="section-title">
                {selectedCategory
                  ? `Results for "${selectedCategory}"`
                  : 'All Products'}
              </h2>
              <span className="product-count">{total} items found</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {loading ? (
            <div className="products-grid">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="product-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-body">
                    <div className="skeleton-line short"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line medium"></div>
                    <div className="skeleton-btn"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="no-products">
                  <span>😕</span>
                  <p>No products found in this category.</p>
                  <button
                    className="btn-primary"
                    onClick={() => handleCategoryChange('')}
                  >
                    Browse All Products
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
