// Profile Page JavaScript
class ProfilePage {
  constructor() {
    this.user = null;
    this.isEditing = false;
    this.currentTab = "overview";
    this.editForm = {
      name: "",
      bio: "",
      location: "",
      businessType: "",
      phone: "",
    };

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
      this.editForm = {
        name: this.user.name || "",
        bio: this.user.bio || "",
        location: this.user.location || "",
        businessType: this.user.businessType || "",
        phone: this.user.phone || "",
      };
    } else {
      window.location.href = "/auth.html";
      return;
    }
  }

  loadMockData() {
    // Mock products for stats
    this.products = [
      { views: 45, inquiries: 8 },
      { views: 32, inquiries: 5 },
    ];

    // Mock reviews
    this.reviews = [
      {
        id: "1",
        fromUserId: "2",
        toUserId: this.user?.id,
        rating: 5,
        comment:
          "Excellent quality produce! Always fresh and delivered on time. Highly recommended!",
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "2",
        fromUserId: "3",
        toUserId: this.user?.id,
        rating: 4,
        comment:
          "Great communication and fair prices. Will definitely buy again.",
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        id: "3",
        fromUserId: "4",
        toUserId: this.user?.id,
        rating: 5,
        comment: "Amazing organic vegetables! You can taste the difference.",
        createdAt: new Date(Date.now() - 259200000),
      },
    ];

    this.reviewers = [
      { id: "2", name: "Sarah Johnson", avatar: "" },
      { id: "3", name: "Mike Chen", avatar: "" },
      { id: "4", name: "Emma Wilson", avatar: "" },
    ];

    // Mock app feedback
    this.appFeedback = [
      {
        id: "1",
        type: "feature",
        title: "Add photo filters for product images",
        description:
          "It would be great to have built-in filters to enhance product photos.",
        status: "in_review",
        createdAt: new Date(Date.now() - 604800000),
      },
      {
        id: "2",
        type: "bug",
        title: "Chat notifications not working",
        description:
          "Sometimes I don't receive notifications when customers send messages.",
        status: "resolved",
        createdAt: new Date(Date.now() - 1209600000),
      },
    ];
  }

  render() {
    const app = document.getElementById("app");
    if (!app) return;

    const stats = this.calculateStats();

    app.innerHTML = `
      <div class="profile-page">
        <!-- Header -->
        <header class="profile-header">
          <div class="header-content">
            <div class="header-actions">
              <h1 class="page-title">Profile</h1>
              <button class="edit-btn" id="edit-toggle-btn">
                <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="profile-main">
          <!-- Tab Navigation -->
          <div class="tabs-container">
            <div class="tabs-list">
              <button class="tab-button ${this.currentTab === "overview" ? "active" : ""}" data-tab="overview">Overview</button>
              <button class="tab-button ${this.currentTab === "reviews" ? "active" : ""}" data-tab="reviews">Reviews</button>
              <button class="tab-button ${this.currentTab === "settings" ? "active" : ""}" data-tab="settings">Settings</button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="tab-content ${this.currentTab === "overview" ? "active" : ""}" id="overview-tab">
            ${this.renderOverviewTab(stats)}
          </div>

          <div class="tab-content ${this.currentTab === "reviews" ? "active" : ""}" id="reviews-tab">
            ${this.renderReviewsTab()}
          </div>

          <div class="tab-content ${this.currentTab === "settings" ? "active" : ""}" id="settings-tab">
            ${this.renderSettingsTab()}
          </div>
        </main>

        <!-- Bottom Navigation -->
        ${this.renderBottomNavigation()}

        <!-- Toast Container -->
        <div id="toaster" class="toaster"></div>
      </div>
    `;
  }

  renderOverviewTab(stats) {
    return `
      <!-- Profile Header Card -->
      <div class="profile-card">
        <div class="profile-content">
          <div class="profile-info">
            <div class="avatar-container">
              <div class="avatar">
                ${
                  this.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"
                }
              </div>
            </div>
            
            <div class="user-details">
              ${this.isEditing ? this.renderEditForm() : this.renderProfileDisplay()}
            </div>
          </div>
          
          <div class="user-meta">
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              ${
                this.isEditing
                  ? `
                <input 
                  type="text" 
                  id="edit-location" 
                  class="edit-input" 
                  value="${this.editForm.location}"
                  placeholder="Location"
                />
              `
                  : `<span>${this.user?.location}</span>`
              }
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              <span>Joined ${this.formatDate(this.user?.createdAt, "MMM yyyy")}</span>
            </div>
          </div>

          ${
            this.isEditing
              ? `
            <div class="edit-actions">
              <button class="save-btn" id="save-profile-btn">Save Changes</button>
              <button class="cancel-btn" id="cancel-edit-btn">Cancel</button>
            </div>
          `
              : ""
          }
        </div>
      </div>

      <!-- Business Info Card -->
      <div class="info-card">
        <div class="card-header">
          <h3 class="card-title">Business Information</h3>
        </div>
        <div class="card-content">
          <div class="info-list">
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <div class="info-details">
                <p class="info-label">Business Type</p>
                ${
                  this.isEditing
                    ? `
                  <input 
                    type="text" 
                    id="edit-business-type" 
                    class="edit-input" 
                    value="${this.editForm.businessType}"
                    placeholder="e.g., Organic Vegetables, Dairy"
                  />
                `
                    : `<p class="info-value">${this.user?.businessType || "Not specified"}</p>`
                }
              </div>
            </div>
            
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <div class="info-details">
                <p class="info-label">Phone</p>
                ${
                  this.isEditing
                    ? `
                  <input 
                    type="tel" 
                    id="edit-phone" 
                    class="edit-input" 
                    value="${this.editForm.phone}"
                    placeholder="Phone number"
                  />
                `
                    : `<p class="info-value">${this.user?.phone || "Not provided"}</p>`
                }
              </div>
            </div>
            
            <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <div class="info-details">
                <p class="info-label">Email</p>
                <p class="info-value">${this.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-icon blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <p class="metric-value">${stats.totalViews}</p>
            <p class="metric-label">Total Views</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-icon purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p class="metric-value">${stats.totalInquiries}</p>
            <p class="metric-label">Inquiries</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-icon green">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
            </div>
            <p class="metric-value">${this.products.length}</p>
            <p class="metric-label">Products</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-content">
            <div class="metric-icon yellow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <p class="metric-value">${stats.avgRating.toFixed(1)}</p>
            <p class="metric-label">Avg Rating</p>
          </div>
        </div>
      </div>
    `;
  }

  renderProfileDisplay() {
    return `
      <div class="profile-display">
        <div class="name-container">
          <h2 class="user-name">${this.user?.name}</h2>
          <div class="role-badge">${this.user?.role?.replace("_", " ")}</div>
        </div>
        ${this.user?.bio ? `<p class="user-bio">${this.user.bio}</p>` : ""}
      </div>
    `;
  }

  renderEditForm() {
    return `
      <div class="edit-form">
        <div class="form-group">
          <input 
            type="text" 
            id="edit-name" 
            class="edit-input" 
            value="${this.editForm.name}"
            placeholder="Full name"
          />
        </div>
        <div class="form-group">
          <textarea 
            id="edit-bio" 
            class="edit-textarea" 
            placeholder="Tell us about yourself and your business..."
            rows="3"
          >${this.editForm.bio}</textarea>
        </div>
      </div>
    `;
  }

  renderReviewsTab() {
    const avgRating =
      this.reviews.length > 0
        ? this.reviews.reduce((sum, review) => sum + review.rating, 0) /
          this.reviews.length
        : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: this.reviews.filter((review) => review.rating === rating).length,
      percentage:
        this.reviews.length > 0
          ? (this.reviews.filter((review) => review.rating === rating).length /
              this.reviews.length) *
            100
          : 0,
    }));

    return `
      <!-- Review Overview -->
      <div class="review-overview-card">
        <div class="overview-content">
          <div class="rating-summary">
            <p class="overall-rating">${avgRating.toFixed(1)}</p>
            <div class="rating-stars">
              ${this.renderStars(avgRating)}
            </div>
            <p class="review-count">Based on ${this.reviews.length} reviews</p>
          </div>

          <div class="rating-distribution">
            ${ratingDistribution
              .map(
                ({ rating, count, percentage }) => `
              <div class="rating-row">
                <span class="rating-number">${rating}★</span>
                <div class="rating-bar">
                  <div class="rating-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${count}</span>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-section">
        <h3 class="section-title">All Reviews</h3>
        ${
          this.reviews.length === 0
            ? `
          <div class="empty-reviews">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <h3 class="empty-title">No reviews yet</h3>
            <p class="empty-description">Start selling to receive your first customer review!</p>
          </div>
        `
            : `
          <div class="reviews-list">
            ${this.reviews.map((review) => this.renderReviewCard(review)).join("")}
          </div>
        `
        }
      </div>
    `;
  }

  renderReviewCard(review) {
    const reviewer = this.reviewers.find((r) => r.id === review.fromUserId);

    return `
      <div class="review-card">
        <div class="review-content">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                ${
                  reviewer?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"
                }
              </div>
              <div class="reviewer-details">
                <h4 class="reviewer-name">${reviewer?.name || "Anonymous User"}</h4>
                <span class="review-date">${this.formatDate(review.createdAt, "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
          
          <div class="review-rating">
            ${this.renderStars(review.rating)}
            <span class="rating-text">(${review.rating}/5)</span>
          </div>
          
          ${
            review.comment
              ? `
            <p class="review-comment">${review.comment}</p>
          `
              : ""
          }
        </div>
      </div>
    `;
  }

  renderSettingsTab() {
    return `
      <div class="settings-section">
        <div class="settings-card">
          <div class="card-header">
            <h3 class="card-title">Account Settings</h3>
          </div>
          <div class="card-content">
            <div class="settings-list">
              <button class="setting-item">
                <svg class="setting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Notification Preferences</span>
                <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
              
              <button class="setting-item">
                <svg class="setting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Privacy Settings</span>
                <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
              
              <button class="setting-item">
                <svg class="setting-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Account Security</span>
                <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="logout-card">
          <div class="card-content">
            <button class="logout-btn" id="logout-btn">
              <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" x2="9" y1="12" y2="12"/>
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderBottomNavigation() {
    return `
      <nav class="bottom-navigation">
        <div class="nav-container">
          <a href="/dashboard.html" class="nav-item">
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
          
          <a href="/profile.html" class="nav-item active">
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

  renderStars(rating) {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < rating;
      return `
        <svg class="star ${filled ? "filled" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      `;
    }).join("");
  }

  attachEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Edit toggle
    const editToggleBtn = document.getElementById("edit-toggle-btn");
    if (editToggleBtn) {
      editToggleBtn.addEventListener("click", () => this.toggleEdit());
    }

    // Save profile
    const saveBtn = document.getElementById("save-profile-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => this.saveProfile());
    }

    // Cancel edit
    const cancelBtn = document.getElementById("cancel-edit-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.cancelEdit());
    }

    // Logout button
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => this.logout());
    }

    // Add product button
    const addNavBtn = document.getElementById("add-nav-btn");
    if (addNavBtn) {
      addNavBtn.addEventListener("click", () => {
        this.showToast("Add Product feature coming soon!", "info");
      });
    }

    // Settings items
    const settingItems = document.querySelectorAll(".setting-item");
    settingItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.showToast("Settings feature coming soon!", "info");
      });
    });

    // Form inputs (if in edit mode)
    this.setupEditFormListeners();

    // Add touch feedback
    this.addTouchFeedback();
  }

  setupEditFormListeners() {
    const inputs = [
      "edit-name",
      "edit-bio",
      "edit-location",
      "edit-business-type",
      "edit-phone",
    ];

    inputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener("input", (e) => {
          const field = inputId.replace("edit-", "");
          this.editForm[field] = e.target.value;
        });
      }
    });
  }

  switchTab(tab) {
    this.currentTab = tab;

    // Update tab buttons
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach((button) => {
      if (button.dataset.tab === tab) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });

    // Update tab content
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    const activeContent = document.getElementById(`${tab}-tab`);
    if (activeContent) {
      activeContent.classList.add("active");
    }

    // Re-render the active tab
    this.renderActiveTab();
  }

  renderActiveTab() {
    const activeContent = document.getElementById(`${this.currentTab}-tab`);
    if (!activeContent) return;

    if (this.currentTab === "overview") {
      const stats = this.calculateStats();
      activeContent.innerHTML = this.renderOverviewTab(stats);
    } else if (this.currentTab === "reviews") {
      activeContent.innerHTML = this.renderReviewsTab();
    } else if (this.currentTab === "settings") {
      activeContent.innerHTML = this.renderSettingsTab();
    }

    // Reattach event listeners for the new content
    this.attachTabSpecificListeners();
  }

  attachTabSpecificListeners() {
    if (this.currentTab === "overview") {
      this.setupEditFormListeners();

      const saveBtn = document.getElementById("save-profile-btn");
      const cancelBtn = document.getElementById("cancel-edit-btn");

      if (saveBtn) saveBtn.addEventListener("click", () => this.saveProfile());
      if (cancelBtn)
        cancelBtn.addEventListener("click", () => this.cancelEdit());
    } else if (this.currentTab === "settings") {
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => this.logout());
      }

      const settingItems = document.querySelectorAll(".setting-item");
      settingItems.forEach((item) => {
        item.addEventListener("click", () => {
          this.showToast("Settings feature coming soon!", "info");
        });
      });
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.renderActiveTab();
  }

  saveProfile() {
    // Validate required fields
    if (!this.editForm.name.trim()) {
      this.showToast("Name is required", "error");
      return;
    }

    if (!this.editForm.location.trim()) {
      this.showToast("Location is required", "error");
      return;
    }

    // Update user data
    this.user = {
      ...this.user,
      name: this.editForm.name.trim(),
      bio: this.editForm.bio.trim(),
      location: this.editForm.location.trim(),
      businessType: this.editForm.businessType.trim(),
      phone: this.editForm.phone.trim(),
    };

    // Save to localStorage
    localStorage.setItem("bizzleap_user", JSON.stringify(this.user));

    this.isEditing = false;
    this.showToast("Profile updated successfully!", "success");
    this.renderActiveTab();
  }

  cancelEdit() {
    // Reset form to original values
    this.editForm = {
      name: this.user?.name || "",
      bio: this.user?.bio || "",
      location: this.user?.location || "",
      businessType: this.user?.businessType || "",
      phone: this.user?.phone || "",
    };

    this.isEditing = false;
    this.renderActiveTab();
  }

  logout() {
    localStorage.removeItem("bizzleap_user");
    this.showToast("Signed out successfully", "success");
    setTimeout(() => {
      window.location.href = "/welcome.html";
    }, 1000);
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
    const avgRating =
      this.reviews.length > 0
        ? this.reviews.reduce((sum, review) => sum + review.rating, 0) /
          this.reviews.length
        : 0;

    return {
      totalViews,
      totalInquiries,
      avgRating,
    };
  }

  formatDate(dateString, format) {
    const date = new Date(dateString);

    if (format === "MMM yyyy") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else if (format === "MMM d, yyyy") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    return date.toLocaleDateString();
  }

  addTouchFeedback() {
    const interactiveElements = document.querySelectorAll(
      ".tab-button, .edit-btn, .save-btn, .cancel-btn, .logout-btn, .setting-item, .nav-item",
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
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProfilePage();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProfilePage;
}
