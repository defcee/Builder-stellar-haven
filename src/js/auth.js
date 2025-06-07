// Auth Page JavaScript
class AuthPage {
  constructor() {
    this.currentTab = "login";
    this.isLoading = false;
    this.formData = {
      login: {
        email: "",
        password: "",
      },
      register: {
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "farmer",
        location: "",
        businessType: "",
        bio: "",
      },
    };

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // Check if user is already authenticated
    const user = localStorage.getItem("bizzleap_user");
    if (user) {
      this.navigateToDashboard();
    }
  }

  render() {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
      <div class="auth-page">
        <!-- Header -->
        <header class="auth-header">
          <div class="header-container">
            <button id="back-btn" class="back-button">
              <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              <span>Back</span>
            </button>
            <div class="header-logo">
              <div class="logo-icon">
                <svg class="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <span class="logo-text">Bizzleap</span>
            </div>
            <div class="spacer"></div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="auth-main">
          <div class="auth-container">
            <div class="auth-card">
              <!-- Card Header -->
              <div class="card-header">
                <h1 class="card-title">Bizzleap</h1>
                <p class="card-description" id="card-description">
                  Welcome back! Please sign in to your account.
                </p>
              </div>

              <!-- Card Content -->
              <div class="card-content">
                <!-- Tab Navigation -->
                <div class="tabs-list">
                  <button id="login-tab" class="tab-button active">Login</button>
                  <button id="register-tab" class="tab-button">Sign Up</button>
                </div>

                <!-- Login Form -->
                <div id="login-form" class="tab-content active">
                  <form class="auth-form" id="login-form-element">
                    <div class="form-group">
                      <label for="login-email" class="form-label">Email</label>
                      <input 
                        type="email" 
                        id="login-email" 
                        class="form-input" 
                        placeholder="Enter your email"
                        required
                      />
                      <div class="error-message" id="login-email-error"></div>
                    </div>

                    <div class="form-group">
                      <label for="login-password" class="form-label">Password</label>
                      <input 
                        type="password" 
                        id="login-password" 
                        class="form-input" 
                        placeholder="Enter your password"
                        required
                      />
                      <div class="error-message" id="login-password-error"></div>
                    </div>

                    <button type="submit" class="auth-button" id="login-submit">
                      <svg class="loading-spinner hidden" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                        <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" opacity="0.75"/>
                      </svg>
                      <span class="button-text">Sign In</span>
                    </button>
                  </form>
                </div>

                <!-- Register Form -->
                <div id="register-form" class="tab-content">
                  <form class="auth-form" id="register-form-element">
                    <div class="form-group">
                      <label for="register-name" class="form-label">Full Name</label>
                      <input 
                        type="text" 
                        id="register-name" 
                        class="form-input" 
                        placeholder="Enter your full name"
                        required
                      />
                      <div class="error-message" id="register-name-error"></div>
                    </div>

                    <div class="form-group">
                      <label for="register-email" class="form-label">Email</label>
                      <input 
                        type="email" 
                        id="register-email" 
                        class="form-input" 
                        placeholder="Enter your email"
                        required
                      />
                      <div class="error-message" id="register-email-error"></div>
                    </div>

                    <div class="form-group">
                      <label for="register-phone" class="form-label">Phone Number (Optional)</label>
                      <input 
                        type="tel" 
                        id="register-phone" 
                        class="form-input" 
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">I am a:</label>
                      <div class="radio-group">
                        <label class="radio-item">
                          <input type="radio" name="role" value="farmer" checked />
                          <span class="radio-button"></span>
                          <span class="radio-label">Farmer</span>
                        </label>
                        <label class="radio-item">
                          <input type="radio" name="role" value="business_owner" />
                          <span class="radio-button"></span>
                          <span class="radio-label">Small Business Owner</span>
                        </label>
                        <label class="radio-item">
                          <input type="radio" name="role" value="buyer" />
                          <span class="radio-button"></span>
                          <span class="radio-label">Buyer</span>
                        </label>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="register-location" class="form-label">Location</label>
                      <input 
                        type="text" 
                        id="register-location" 
                        class="form-input" 
                        placeholder="City, Country"
                        required
                      />
                      <div class="error-message" id="register-location-error"></div>
                    </div>

                    <div class="form-group">
                      <label for="register-business-type" class="form-label">Business Type (Optional)</label>
                      <input 
                        type="text" 
                        id="register-business-type" 
                        class="form-input" 
                        placeholder="e.g., Organic Vegetables, Dairy, Crafts"
                      />
                    </div>

                    <div class="form-group">
                      <label for="register-password" class="form-label">Password</label>
                      <input 
                        type="password" 
                        id="register-password" 
                        class="form-input" 
                        placeholder="Create a password"
                        required
                      />
                      <div class="error-message" id="register-password-error"></div>
                    </div>

                    <div class="form-group">
                      <label for="register-confirm-password" class="form-label">Confirm Password</label>
                      <input 
                        type="password" 
                        id="register-confirm-password" 
                        class="form-input" 
                        placeholder="Confirm your password"
                        required
                      />
                      <div class="error-message" id="register-confirm-password-error"></div>
                    </div>

                    <button type="submit" class="auth-button" id="register-submit">
                      <svg class="loading-spinner hidden" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                        <path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" opacity="0.75"/>
                      </svg>
                      <span class="button-text">Create Account</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Toast Container -->
        <div id="toaster" class="toaster"></div>
      </div>
    `;
  }

  attachEventListeners() {
    // Tab switching
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");

    if (loginTab) {
      loginTab.addEventListener("click", () => this.switchTab("login"));
    }

    if (registerTab) {
      registerTab.addEventListener("click", () => this.switchTab("register"));
    }

    // Back button
    const backBtn = document.getElementById("back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => this.navigateBack());
    }

    // Form submissions
    const loginForm = document.getElementById("login-form-element");
    const registerForm = document.getElementById("register-form-element");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => this.handleRegister(e));
    }

    // Real-time validation
    this.setupFormValidation();
  }

  switchTab(tab) {
    this.currentTab = tab;

    // Update tab buttons
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const cardDescription = document.getElementById("card-description");

    if (tab === "login") {
      loginTab?.classList.add("active");
      registerTab?.classList.remove("active");
      if (cardDescription) {
        cardDescription.textContent =
          "Welcome back! Please sign in to your account.";
      }
    } else {
      registerTab?.classList.add("active");
      loginTab?.classList.remove("active");
      if (cardDescription) {
        cardDescription.textContent =
          "Join our community of farmers and entrepreneurs.";
      }
    }

    // Update form visibility
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (tab === "login") {
      loginForm?.classList.add("active");
      registerForm?.classList.remove("active");
    } else {
      registerForm?.classList.add("active");
      loginForm?.classList.remove("active");
    }
  }

  setupFormValidation() {
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateEmail(input));
      input.addEventListener("input", () => this.clearError(input));
    });

    // Password validation
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach((input) => {
      input.addEventListener("blur", () => this.validatePassword(input));
      input.addEventListener("input", () => this.clearError(input));
    });

    // Name validation
    const nameInput = document.getElementById("register-name");
    if (nameInput) {
      nameInput.addEventListener("blur", () => this.validateName(nameInput));
      nameInput.addEventListener("input", () => this.clearError(nameInput));
    }

    // Location validation
    const locationInput = document.getElementById("register-location");
    if (locationInput) {
      locationInput.addEventListener("blur", () =>
        this.validateLocation(locationInput),
      );
      locationInput.addEventListener("input", () =>
        this.clearError(locationInput),
      );
    }

    // Confirm password validation
    const confirmPasswordInput = document.getElementById(
      "register-confirm-password",
    );
    if (confirmPasswordInput) {
      confirmPasswordInput.addEventListener("blur", () =>
        this.validateConfirmPassword(),
      );
      confirmPasswordInput.addEventListener("input", () =>
        this.clearError(confirmPasswordInput),
      );
    }
  }

  validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      this.showFieldError(input, "Email is required");
      return false;
    }

    if (!emailRegex.test(email)) {
      this.showFieldError(input, "Please enter a valid email address");
      return false;
    }

    this.clearError(input);
    return true;
  }

  validatePassword(input) {
    const password = input.value;

    if (!password) {
      this.showFieldError(input, "Password is required");
      return false;
    }

    if (password.length < 6) {
      this.showFieldError(input, "Password must be at least 6 characters");
      return false;
    }

    this.clearError(input);
    return true;
  }

  validateName(input) {
    const name = input.value.trim();

    if (!name) {
      this.showFieldError(input, "Full name is required");
      return false;
    }

    if (name.length < 2) {
      this.showFieldError(input, "Name must be at least 2 characters");
      return false;
    }

    this.clearError(input);
    return true;
  }

  validateLocation(input) {
    const location = input.value.trim();

    if (!location) {
      this.showFieldError(input, "Location is required");
      return false;
    }

    if (location.length < 2) {
      this.showFieldError(input, "Please enter your location");
      return false;
    }

    this.clearError(input);
    return true;
  }

  validateConfirmPassword() {
    const password = document.getElementById("register-password")?.value;
    const confirmPassword = document.getElementById(
      "register-confirm-password",
    )?.value;
    const confirmInput = document.getElementById("register-confirm-password");

    if (!confirmPassword) {
      this.showFieldError(confirmInput, "Please confirm your password");
      return false;
    }

    if (password !== confirmPassword) {
      this.showFieldError(confirmInput, "Passwords don't match");
      return false;
    }

    this.clearError(confirmInput);
    return true;
  }

  showFieldError(input, message) {
    const errorElement = document.getElementById(input.id + "-error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
    input.classList.add("error");
  }

  clearError(input) {
    const errorElement = document.getElementById(input.id + "-error");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
    input.classList.remove("error");
  }

  async handleLogin(e) {
    e.preventDefault();

    if (this.isLoading) return;

    const email = document.getElementById("login-email")?.value.trim();
    const password = document.getElementById("login-password")?.value;

    // Validate inputs
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    let isValid = true;

    if (!this.validateEmail(emailInput)) isValid = false;
    if (!this.validatePassword(passwordInput)) isValid = false;

    if (!isValid) return;

    this.setLoading(true, "login");

    try {
      // Simulate API call
      await this.delay(1000);

      // Mock user data
      const userData = {
        id: "1",
        email,
        name: "John Farmer",
        role: "farmer",
        location: "Nairobi, Kenya",
        businessType: "Organic Vegetables",
        bio: "Passionate farmer growing organic vegetables for the local community.",
        createdAt: new Date().toISOString(),
      };

      // Store user data
      localStorage.setItem("bizzleap_user", JSON.stringify(userData));

      this.showToast("Welcome back!", "success");

      // Navigate to dashboard
      setTimeout(() => {
        this.navigateToDashboard();
      }, 1000);
    } catch (error) {
      this.showToast("Login failed. Please try again.", "error");
    } finally {
      this.setLoading(false, "login");
    }
  }

  async handleRegister(e) {
    e.preventDefault();

    if (this.isLoading) return;

    // Get form data
    const name = document.getElementById("register-name")?.value.trim();
    const email = document.getElementById("register-email")?.value.trim();
    const phone = document.getElementById("register-phone")?.value.trim();
    const password = document.getElementById("register-password")?.value;
    const location = document.getElementById("register-location")?.value.trim();
    const businessType = document
      .getElementById("register-business-type")
      ?.value.trim();
    const roleElement = document.querySelector('input[name="role"]:checked');
    const role = roleElement?.value || "farmer";

    // Validate all inputs
    let isValid = true;
    const inputs = [
      {
        element: document.getElementById("register-name"),
        validator: () =>
          this.validateName(document.getElementById("register-name")),
      },
      {
        element: document.getElementById("register-email"),
        validator: () =>
          this.validateEmail(document.getElementById("register-email")),
      },
      {
        element: document.getElementById("register-password"),
        validator: () =>
          this.validatePassword(document.getElementById("register-password")),
      },
      {
        element: document.getElementById("register-location"),
        validator: () =>
          this.validateLocation(document.getElementById("register-location")),
      },
      {
        element: document.getElementById("register-confirm-password"),
        validator: () => this.validateConfirmPassword(),
      },
    ];

    inputs.forEach(({ validator }) => {
      if (!validator()) isValid = false;
    });

    if (!isValid) return;

    this.setLoading(true, "register");

    try {
      // Simulate API call
      await this.delay(1000);

      const userData = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        role,
        location,
        businessType,
        bio: "",
        createdAt: new Date().toISOString(),
      };

      // Store user data
      localStorage.setItem("bizzleap_user", JSON.stringify(userData));

      this.showToast("Account created successfully!", "success");

      // Navigate to dashboard
      setTimeout(() => {
        this.navigateToDashboard();
      }, 1000);
    } catch (error) {
      this.showToast("Registration failed. Please try again.", "error");
    } finally {
      this.setLoading(false, "register");
    }
  }

  setLoading(loading, form) {
    this.isLoading = loading;
    const submitBtn = document.getElementById(form + "-submit");
    const spinner = submitBtn?.querySelector(".loading-spinner");
    const buttonText = submitBtn?.querySelector(".button-text");

    if (loading) {
      submitBtn?.setAttribute("disabled", "true");
      spinner?.classList.remove("hidden");
      if (buttonText) {
        buttonText.textContent =
          form === "login" ? "Signing In..." : "Creating Account...";
      }
    } else {
      submitBtn?.removeAttribute("disabled");
      spinner?.classList.add("hidden");
      if (buttonText) {
        buttonText.textContent =
          form === "login" ? "Sign In" : "Create Account";
      }
    }
  }

  navigateBack() {
    window.history.back() || (window.location.href = "/welcome.html");
  }

  navigateToDashboard() {
    window.location.href = "/dashboard.html";
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

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthPage();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = AuthPage;
}
