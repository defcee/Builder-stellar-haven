// Dashboard Page JavaScript
class DashboardPage {
  constructor() {
    this.user = null;
    this.products = [];
    this.searchQuery = "";
    this.isLoading = false;

    this.init();
  }

  init() {
    this.loadUserData();
    this.loadMockData();
    this.render();
    this.attachEventListeners();
  }

  loadUserData() {
    const userData = localStorage.getItem("bizzleap_user");
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // Redirect to auth if not logged in
      window.location.href = "/auth.html";
      return;
    }
  }

  loadMockData() {
    // Mock products data
    this.products = [
      {
        id: "1",
        userId: this.user?.id,
        title: "Fresh Organic Tomatoes",
        description:
          "Premium quality organic tomatoes grown without pesticides. Perfect for salads and cooking.",
        price: 5.99,
        images: ["/placeholder.svg"],
        category: "Vegetables",
        inStock: true,
        views: 45,
        inquiries: 8,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      },
      {
        id: "2",
        userId: this.user?.id,
        title: "Farm Fresh Chicken Eggs",
        description:
          "Free-range chicken eggs from happy, healthy chickens. Rich in nutrients and flavor.",
        price: 3.49,
        images: ["/placeholder.svg"],
        category: "Dairy & Eggs",
        inStock: true,
        views: 32,
        inquiries: 5,
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(),
      },
    ];
  }

  render() {
    const app = document.getElementById("app");
    if (!app) return;

    const filteredProducts = this.getFilteredProducts();
    const stats = this.calculateStats();

    app.innerHTML = `
      <div class="dashboard-page">
        <!-- Header -->
        <header class="dashboard-header">
          <div class="header-content">
            <div class="header-top">
              <div class="user-greeting">
                <h1 class="greeting-text">Welcome back, ${this.user?.name?.split(" ")[0]}! 👋</h1>
                <p class="business-type">${this.user?.businessType || "Manage your business"}</p>
              </div>
              <button class="notification-btn" id="notification-btn">
                <svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span class="notification-badge">3</span>
              </button>
            </div>
            
            <div class="search-container">
              <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                id="search-input" 
                class="search-input" 
                placeholder="Search your products..."
                value="${this.searchQuery}"
              />
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="dashboard-main">
          <!-- Quick Stats -->
          <section class="stats-section">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                    </svg>
                  </div>
                  <div class="stat-data">
                    <p class="stat-value">${stats.activeProducts}</p>
                    <p class="stat-label">Active Products</p>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div class="stat-data">
                    <p class="stat-value">${stats.totalViews}</p>
                    <p class="stat-label">Total Views</p>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon purple">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div class="stat-data">
                    <p class="stat-value">${stats.totalInquiries}</p>
                    <p class="stat-label">Inquiries</p>
                  </div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-content">
                  <div class="stat-icon yellow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  </div>
                  <div class="stat-data">
                    <p class="stat-value">4.8</p>
                    <p class="stat-label">Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="actions-section">
            <div class="actions-grid">
              <button class="action-button primary" id="add-product-btn">
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
                <span class="action-text">Add Product</span>
              </button>
              
              <button class="action-button secondary" id="campaigns-btn">
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
                <span class="action-text">Campaigns</span>
              </button>
            </div>
          </section>

          <!-- Products Section -->
          <section class="products-section">
            <div class="section-header">
              <h2 class="section-title">Your Products</h2>
              ${
                filteredProducts.length > 0
                  ? `
                <div class="product-count">
                  ${filteredProducts.length} of ${this.products.length}
                </div>
              `
                  : ""
              }
            </div>

            <div class="products-container">
              ${this.renderProducts(filteredProducts)}
            </div>
          </section>

          <!-- Recent Activity -->
          <section class="activity-section">
            <h2 class="section-title">Recent Activity</h2>
            <div class="activity-card">
              <div class="activity-list">
                <div class="activity-item">
                  <div class="activity-icon green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">Your product "Fresh Organic Tomatoes" was viewed 5 times</p>
                    <p class="activity-time">2 hours ago</p>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">New inquiry about "Farm Fresh Eggs"</p>
                    <p class="activity-time">4 hours ago</p>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon yellow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">You received a 5-star review!</p>
                    <p class="activity-time">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- Bottom Navigation -->
        ${this.renderBottomNavigation()}

        <!-- Toast Container -->
        <div id="toaster" class="toaster"></div>
      </div>
    `;
  }

  renderProducts(products) {
    if (products.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
          <h3 class="empty-title">No products yet</h3>
          <p class="empty-description">
            Start by adding your first product to showcase to potential buyers.
          </p>
          <button class="empty-action" id="add-first-product">
            Add Your First Product
          </button>
        </div>
      `;
    }

    return products
      .map(
        (product) => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image-container">
          <img 
            src="${product.images[0] || "/placeholder.svg"}" 
            alt="${product.title}" 
            class="product-image"
            loading="lazy"
          />
          ${!product.inStock ? '<div class="stock-badge out-of-stock">Out of Stock</div>' : ""}
          <button class="edit-btn" data-product-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
        
        <div class="product-content">
          <div class="product-header">
            <h3 class="product-title">${product.title}</h3>
            <span class="product-price">$${product.price.toFixed(2)}</span>
          </div>
          
          <p class="product-description">${product.description}</p>
          
          <div class="product-category">
            <span class="category-badge">${product.category}</span>
          </div>
          
          <div class="product-stats">
            <div class="stat-item">
              <svg class="stat-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>${product.views}</span>
            </div>
            <div class="stat-item">
              <svg class="stat-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>${product.inquiries}</span>
            </div>
          </div>
        </div>
        
        <div class="product-footer">
          <button class="contact-btn ${product.inStock ? "primary" : "disabled"}" 
                  ${!product.inStock ? "disabled" : ""}>
            ${product.inStock ? "Contact Seller" : "Out of Stock"}
          </button>
        </div>
      </div>
    `,
      )
      .join("");
  }

  renderBottomNavigation() {
    return `
      <nav class="bottom-navigation">
        <div class="nav-container">
          <a href="/dashboard.html" class="nav-item active">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span class="nav-label">Home</span>
          </a>
          
          <a href="/social-campaigns.html" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            <span class="nav-label">Campaign</span>
          </a>
          
          <button class="nav-item special" id="add-nav-btn">
            <div class="special-button">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8"/>
                <path d="M8 12h8"/>
              </svg>
            </div>
          </button>
          
          <a href="/chat.html" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="nav-label">Chat</span>
          </a>
          
          <a href="/profile.html" class="nav-item">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span class="nav-label">Profile</span>
          </a>
        </div>
      </nav>
    `;
  }

  attachEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.updateProductsList();
      });
    }

    // Notification button
    const notificationBtn = document.getElementById("notification-btn");
    if (notificationBtn) {
      notificationBtn.addEventListener("click", () => {
        this.showToast("No new notifications", "info");
      });
    }

    // Action buttons
    const addProductBtn = document.getElementById("add-product-btn");
    const campaignsBtn = document.getElementById("campaigns-btn");
    const addNavBtn = document.getElementById("add-nav-btn");
    const addFirstProduct = document.getElementById("add-first-product");

    [addProductBtn, addNavBtn, addFirstProduct].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => this.handleAddProduct());
      }
    });

    if (campaignsBtn) {
      campaignsBtn.addEventListener("click", () => {
        window.location.href = "/social-campaigns.html";
      });
    }

    // Product edit buttons
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = btn.dataset.productId;
        this.handleEditProduct(productId);
      });
    });

    // Product cards
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card.dataset.productId;
        this.handleProductClick(productId);
      });
    });

    // Contact buttons
    const contactBtns = document.querySelectorAll(
      ".contact-btn:not(.disabled)",
    );
    contactBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleContactSeller();
      });
    });

    // Add touch feedback for mobile
    this.addTouchFeedback();
  }

  getFilteredProducts() {
    if (!this.searchQuery.trim()) return this.products;

    const query = this.searchQuery.toLowerCase();
    return this.products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query),
    );
  }

  calculateStats() {
    const totalViews = this.products.reduce(
      (sum, product) => sum + product.views,
      0,
    );
    const totalInquiries = this.products.reduce(
      (sum, product) => sum + product.inquiries,
      0,
    );
    const activeProducts = this.products.filter(
      (product) => product.inStock,
    ).length;

    return {
      activeProducts,
      totalViews,
      totalInquiries,
    };
  }

  updateProductsList() {
    const productsContainer = document.querySelector(".products-container");
    const sectionHeader = document.querySelector(
      ".products-section .section-header",
    );

    if (productsContainer && sectionHeader) {
      const filteredProducts = this.getFilteredProducts();

      // Update product count
      const productCount = sectionHeader.querySelector(".product-count");
      if (productCount) {
        if (filteredProducts.length > 0) {
          productCount.textContent = `${filteredProducts.length} of ${this.products.length}`;
          productCount.style.display = "block";
        } else {
          productCount.style.display = "none";
        }
      }

      // Update products list
      productsContainer.innerHTML = this.renderProducts(filteredProducts);

      // Reattach event listeners for new elements
      this.attachProductEventListeners();
    }
  }

  attachProductEventListeners() {
    // Product edit buttons
    const editBtns = document.querySelectorAll(".edit-btn");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const productId = btn.dataset.productId;
        this.handleEditProduct(productId);
      });
    });

    // Product cards
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card.dataset.productId;
        this.handleProductClick(productId);
      });
    });

    // Contact buttons
    const contactBtns = document.querySelectorAll(
      ".contact-btn:not(.disabled)",
    );
    contactBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleContactSeller();
      });
    });

    // Add first product button
    const addFirstProduct = document.getElementById("add-first-product");
    if (addFirstProduct) {
      addFirstProduct.addEventListener("click", () => this.handleAddProduct());
    }
  }

  handleAddProduct() {
    this.showToast("Add Product feature coming soon!", "info");
    // In a real app, this would navigate to add product page
    console.log("Navigate to add product page");
  }

  handleEditProduct(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      this.showToast(`Edit product: ${product.title}`, "info");
      console.log("Edit product:", product);
    }
  }

  handleProductClick(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      // Increment views
      product.views++;
      this.showToast(`Viewing ${product.title}`, "info");
      console.log("Product clicked:", product);
    }
  }

  handleContactSeller() {
    this.showToast("Opening chat...", "success");
    setTimeout(() => {
      window.location.href = "/chat.html";
    }, 1000);
  }

  addTouchFeedback() {
    const interactiveElements = document.querySelectorAll(
      ".action-button, .product-card, .nav-item, .edit-btn, .contact-btn, .notification-btn",
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("touchstart", () => {
        element.classList.add("touching");
      });

      element.addEventListener("touchend", () => {
        setTimeout(() => {
          element.classList.remove("touching");
        }, 150);
      });
    });
  }

  showToast(message, type = "info") {
    const toaster = document.getElementById("toaster");
    if (!toaster) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <span>${message}</span>
        <button class="toast-close">&times;</button>
      </div>
    `;

    toaster.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        toast.classList.add("fade-out");
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      });
    }
  }

  // Handle screen orientation changes
  handleOrientationChange() {
    setTimeout(() => {
      this.render();
    }, 100);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const dashboardPage = new DashboardPage();

  // Handle orientation changes for mobile
  window.addEventListener("orientationchange", () => {
    dashboardPage.handleOrientationChange();
  });
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = DashboardPage;
}
