// Mobile Platform JavaScript - Android & iOS Enhancements
class MobilePlatform {
  constructor() {
    this.platform = this.detectPlatform();
    this.isCapacitor = this.detectCapacitor();
    this.isStandalone = this.detectStandalone();
    this.deviceInfo = null;

    this.init();
  }

  init() {
    this.setupPlatformSpecifics();
    this.setupCapacitorPlugins();
    this.setupDeviceInfo();
    this.setupBackButton();
    this.setupKeyboard();
    this.setupStatusBar();
    this.setupSplashScreen();
    this.setupHaptics();
  }

  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      return "android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "ios";
    }

    return "web";
  }

  detectCapacitor() {
    return !!window.Capacitor;
  }

  detectStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone ||
      document.referrer.includes("android-app://")
    );
  }

  async setupCapacitorPlugins() {
    if (!this.isCapacitor) return;

    try {
      // Import Capacitor plugins dynamically
      const { Capacitor } = await import("@capacitor/core");
      const { StatusBar } = await import("@capacitor/status-bar");
      const { SplashScreen } = await import("@capacitor/splash-screen");
      const { Keyboard } = await import("@capacitor/keyboard");
      const { App } = await import("@capacitor/app");
      const { Device } = await import("@capacitor/device");
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      const { Toast } = await import("@capacitor/toast");

      this.capacitor = {
        Capacitor,
        StatusBar,
        SplashScreen,
        Keyboard,
        App,
        Device,
        Haptics,
        ImpactStyle,
        Toast,
      };

      console.log("Capacitor plugins loaded successfully");
    } catch (error) {
      console.warn("Capacitor plugins not available:", error);
    }
  }

  async setupDeviceInfo() {
    if (!this.isCapacitor || !this.capacitor?.Device) return;

    try {
      this.deviceInfo = await this.capacitor.Device.getInfo();
      console.log("Device info:", this.deviceInfo);

      // Add device-specific classes to body
      document.body.classList.add(
        `platform-${this.deviceInfo.platform.toLowerCase()}`,
      );
      document.body.classList.add(
        `model-${this.deviceInfo.model.toLowerCase().replace(/\s+/g, "-")}`,
      );

      // Handle device-specific adjustments
      this.handleDeviceSpecifics();
    } catch (error) {
      console.warn("Could not get device info:", error);
    }
  }

  handleDeviceSpecifics() {
    if (!this.deviceInfo) return;

    // iOS specific adjustments
    if (this.deviceInfo.platform === "ios") {
      // Handle iPhone X and newer with notch/dynamic island
      if (this.hasNotch()) {
        document.body.classList.add("has-notch");
      }

      // Handle iOS version-specific features
      const iosVersion = parseFloat(this.deviceInfo.osVersion);
      if (iosVersion >= 15) {
        document.body.classList.add("ios-15-plus");
      }
    }

    // Android specific adjustments
    if (this.deviceInfo.platform === "android") {
      // Handle Android navigation bars
      document.body.classList.add("android-device");

      // Handle Android version-specific features
      const androidVersion = parseInt(this.deviceInfo.osVersion);
      if (androidVersion >= 10) {
        document.body.classList.add("android-10-plus");
      }
    }
  }

  hasNotch() {
    // Check for iPhone X style notch/dynamic island
    const ratio = window.screen.height / window.screen.width;
    const isIPhoneX = this.platform === "ios" && ratio > 2.0;

    // Also check CSS env() support for safe areas
    const supportsEnv = CSS.supports("padding-top: env(safe-area-inset-top)");

    return isIPhoneX || supportsEnv;
  }

  setupPlatformSpecifics() {
    // Add platform class to body
    document.body.classList.add(`platform-${this.platform}`);

    if (this.isStandalone) {
      document.body.classList.add("standalone-app");
    }

    if (this.isCapacitor) {
      document.body.classList.add("capacitor-app");
    }

    // Platform-specific viewport adjustments
    this.setupViewport();

    // Platform-specific touch handling
    this.setupTouchHandling();
  }

  setupViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');

    if (this.platform === "ios") {
      // iOS specific viewport settings
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
        );
      }
    } else if (this.platform === "android") {
      // Android specific viewport settings
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        );
      }
    }
  }

  setupTouchHandling() {
    // Improve touch responsiveness
    document.addEventListener("touchstart", () => {}, { passive: true });

    // Handle platform-specific scroll behavior
    if (this.platform === "ios") {
      // iOS momentum scrolling
      document.body.style.webkitOverflowScrolling = "touch";
    }

    // Prevent zoom on double tap for both platforms
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false,
    );
  }

  async setupBackButton() {
    if (!this.isCapacitor || !this.capacitor?.App) return;

    try {
      // Handle hardware back button on Android
      this.capacitor.App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          // Show exit confirmation
          this.showExitConfirmation();
        }
      });
    } catch (error) {
      console.warn("Back button setup failed:", error);
    }
  }

  async setupKeyboard() {
    if (!this.isCapacitor || !this.capacitor?.Keyboard) return;

    try {
      // Handle keyboard show/hide events
      this.capacitor.Keyboard.addListener("keyboardWillShow", (info) => {
        document.body.classList.add("keyboard-open");
        // Adjust viewport for keyboard
        const keyboardHeight = info.keyboardHeight;
        document.documentElement.style.setProperty(
          "--keyboard-height",
          `${keyboardHeight}px`,
        );
      });

      this.capacitor.Keyboard.addListener("keyboardWillHide", () => {
        document.body.classList.remove("keyboard-open");
        document.documentElement.style.removeProperty("--keyboard-height");
      });

      // Auto-hide keyboard when tapping outside inputs
      document.addEventListener("click", (event) => {
        if (!event.target.matches("input, textarea, select")) {
          this.capacitor.Keyboard.hide();
        }
      });
    } catch (error) {
      console.warn("Keyboard setup failed:", error);
    }
  }

  async setupStatusBar() {
    if (!this.isCapacitor || !this.capacitor?.StatusBar) return;

    try {
      // Configure status bar
      await this.capacitor.StatusBar.setStyle({ style: "LIGHT_CONTENT" });
      await this.capacitor.StatusBar.setBackgroundColor({ color: "#16a34a" });

      if (this.platform === "ios") {
        await this.capacitor.StatusBar.setOverlaysWebView({ overlay: false });
      }
    } catch (error) {
      console.warn("Status bar setup failed:", error);
    }
  }

  async setupSplashScreen() {
    if (!this.isCapacitor || !this.capacitor?.SplashScreen) return;

    try {
      // Hide splash screen after app is loaded
      window.addEventListener("load", async () => {
        setTimeout(async () => {
          await this.capacitor.SplashScreen.hide();
        }, 1000);
      });
    } catch (error) {
      console.warn("Splash screen setup failed:", error);
    }
  }

  setupHaptics() {
    // Store haptics capability
    this.hasHaptics = this.isCapacitor && this.capacitor?.Haptics;
  }

  // Public methods for app to use

  async triggerHaptic(type = "light") {
    if (!this.hasHaptics) return;

    try {
      const impacts = {
        light: this.capacitor.ImpactStyle.Light,
        medium: this.capacitor.ImpactStyle.Medium,
        heavy: this.capacitor.ImpactStyle.Heavy,
      };

      await this.capacitor.Haptics.impact({
        style: impacts[type] || impacts.light,
      });
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
  }

  async showToast(message, duration = "short") {
    if (!this.isCapacitor || !this.capacitor?.Toast) {
      // Fallback to web toast
      this.showWebToast(message);
      return;
    }

    try {
      await this.capacitor.Toast.show({
        text: message,
        duration: duration,
        position: "bottom",
      });
    } catch (error) {
      console.warn("Native toast failed, using web fallback:", error);
      this.showWebToast(message);
    }
  }

  showWebToast(message) {
    // Fallback web toast implementation
    const toast = document.createElement("div");
    toast.className = "web-toast";
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      font-size: 14px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "1"), 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  async showExitConfirmation() {
    const confirmed = confirm("Are you sure you want to exit Bizzleap?");
    if (confirmed && this.isCapacitor) {
      try {
        await this.capacitor.App.exitApp();
      } catch (error) {
        console.warn("Could not exit app:", error);
      }
    }
  }

  async openUrl(url) {
    if (this.isCapacitor && this.capacitor?.App) {
      try {
        await this.capacitor.App.openUrl({ url });
      } catch (error) {
        console.warn("Could not open URL natively, using fallback:", error);
        window.open(url, "_blank");
      }
    } else {
      window.open(url, "_blank");
    }
  }

  async shareContent(content) {
    if (navigator.share) {
      try {
        await navigator.share(content);
        return true;
      } catch (error) {
        console.warn("Web Share API failed:", error);
      }
    }

    // Fallback for platforms without native sharing
    if (content.url) {
      this.copyToClipboard(content.url);
      this.showToast("Link copied to clipboard");
    }

    return false;
  }

  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn("Clipboard API failed:", error);

      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackError) {
        console.warn("Fallback copy failed:", fallbackError);
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  // Getters for app to check platform capabilities
  get isIOS() {
    return this.platform === "ios";
  }

  get isAndroid() {
    return this.platform === "android";
  }

  get isNative() {
    return this.isCapacitor;
  }

  get canVibrate() {
    return this.hasHaptics || "vibrate" in navigator;
  }

  get canShare() {
    return "share" in navigator || this.isCapacitor;
  }

  // Device orientation handling
  setupOrientationHandling() {
    const handleOrientationChange = () => {
      // Add orientation class
      const orientation =
        window.innerHeight > window.innerWidth ? "portrait" : "landscape";
      document.body.className = document.body.className.replace(
        /orientation-\w+/g,
        "",
      );
      document.body.classList.add(`orientation-${orientation}`);

      // Trigger custom event
      window.dispatchEvent(
        new CustomEvent("orientationchange", {
          detail: { orientation },
        }),
      );
    };

    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    handleOrientationChange(); // Initial call
  }
}

// Initialize platform detection
const mobilePlatform = new MobilePlatform();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.MobilePlatform = mobilePlatform;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = MobilePlatform;
}
