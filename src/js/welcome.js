// Welcome Page JavaScript
class WelcomePage {
  constructor() {
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
      <div class="welcome-page">
        <!-- Toaster -->
        <div id="toaster" class="toaster"></div>
        
        <!-- Main Content -->
        <div class="welcome-container">
          <!-- Header -->
          <header class="welcome-header">
            <div class="header-background"></div>
            <div class="header-content">
              <div class="logo-container">
                <div class="logo-icon">
                  <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
                <h1 class="logo-text">Bizzleap</h1>
              </div>
              <p class="tagline">
                Empowering farmers and small businesses to grow, connect, and thrive in the digital marketplace
              </p>
              <div class="mobile-badge">
                <svg class="mobile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                  <path d="M12 18h.01"/>
                </svg>
                <span>Mobile Optimized</span>
              </div>
            </div>
          </header>

          <!-- Main Content -->
          <main class="welcome-main">
            <!-- Hero CTA -->
            <section class="hero-section">
              <div class="cta-container">
                <button id="get-started-btn" class="primary-button">
                  <span>Get Started Free</span>
                  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
                <p class="signin-text">
                  Already have an account? 
                  <a href="#" id="signin-link" class="signin-link">Sign In</a>
                </p>
              </div>
            </section>

            <!-- Features Section -->
            <section class="features-section">
              <h2 class="section-title">Built for Your Success</h2>
              <div class="features-grid">
                <div class="feature-card">
                  <div class="feature-content">
                    <div class="feature-icon green">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                      </svg>
                    </div>
                    <h3 class="feature-title">For Farmers</h3>
                    <p class="feature-description">Showcase your fresh produce and connect directly with buyers</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-content">
                    <div class="feature-icon blue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
                        <path d="m13 13 6 6"/>
                      </svg>
                    </div>
                    <h3 class="feature-title">Grow Your Business</h3>
                    <p class="feature-description">Market your products and services to a wider audience</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-content">
                    <div class="feature-icon purple">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <h3 class="feature-title">Direct Communication</h3>
                    <p class="feature-description">Chat directly with customers and build lasting relationships</p>
                  </div>
                </div>

                <div class="feature-card">
                  <div class="feature-content">
                    <div class="feature-icon yellow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                    </div>
                    <h3 class="feature-title">Build Your Reputation</h3>
                    <p class="feature-description">Collect reviews and showcase your quality work</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Benefits Section -->
            <section class="benefits-section">
              <h2 class="section-title">Everything You Need</h2>
              <div class="benefits-card">
                <div class="benefits-list">
                  <div class="benefit-item">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <span>Easy product listing and management</span>
                  </div>
                  <div class="benefit-item">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <span>Social media campaign tools</span>
                  </div>
                  <div class="benefit-item">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <span>Direct messaging with customers</span>
                  </div>
                  <div class="benefit-item">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <span>Review and rating system</span>
                  </div>
                  <div class="benefit-item">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <span>Mobile-first design</span>
                  </div>
                  <div class="benefit-item">
                    <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    <span>Secure payment integration</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- Social Proof Section -->
            <section class="social-proof-section">
              <div class="stats-container">
                <div class="stat-item">
                  <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>1000+ Users</span>
                </div>
                <div class="stat-item">
                  <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  <span>4.8 Rating</span>
                </div>
                <div class="stat-item">
                  <svg class="stat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                  </svg>
                  <span>Growing Fast</span>
                </div>
              </div>
            </section>

            <!-- Final CTA Section -->
            <section class="final-cta-section">
              <h3 class="cta-title">Ready to grow your business?</h3>
              <button id="join-today-btn" class="primary-button">
                <span>Join Bizzleap Today</span>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            </section>
          </main>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Get Started button
    const getStartedBtn = document.getElementById("get-started-btn");
    if (getStartedBtn) {
      getStartedBtn.addEventListener("click", () => {
        this.navigateToAuth();
      });
    }

    // Join Today button
    const joinTodayBtn = document.getElementById("join-today-btn");
    if (joinTodayBtn) {
      joinTodayBtn.addEventListener("click", () => {
        this.navigateToAuth();
      });
    }

    // Sign In link
    const signinLink = document.getElementById("signin-link");
    if (signinLink) {
      signinLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigateToAuth();
      });
    }

    // Add touch feedback for mobile
    this.addTouchFeedback();
  }

  addTouchFeedback() {
    const buttons = document.querySelectorAll(".primary-button, .feature-card");
    buttons.forEach((button) => {
      button.addEventListener("touchstart", () => {
        button.classList.add("touching");
      });

      button.addEventListener("touchend", () => {
        setTimeout(() => {
          button.classList.remove("touching");
        }, 150);
      });
    });
  }

  navigateToAuth() {
    // In a real app, this would navigate to the auth page
    console.log("Navigating to auth page...");

    // For demo purposes, show a toast
    this.showToast("Redirecting to authentication...", "success");

    // Simulate navigation
    setTimeout(() => {
      window.location.href = "/auth.html";
    }, 1000);
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
      window.scrollTo(0, 0);
    }, 100);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const welcomePage = new WelcomePage();

  // Handle orientation changes for mobile
  window.addEventListener("orientationchange", () => {
    welcomePage.handleOrientationChange();
  });
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = WelcomePage;
}
