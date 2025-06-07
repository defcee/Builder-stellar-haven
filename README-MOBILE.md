# 📱 Bizzleap Mobile App

**Empowering farmers and small businesses to grow, connect, and thrive in the digital marketplace**

## 🚀 Quick Start

### Web Version (Instant)

```bash
# Serve locally
npm run serve
# Open http://localhost:8080
```

### Android Development

```bash
# Build and run on Android
./build-mobile.sh android
```

### iOS Development (macOS only)

```bash
# Build and run on iOS
./build-mobile.sh ios
```

## 📋 Prerequisites

### For Web Development

- **Node.js 16+**
- **npm 8+**

### For Android Development

- **Android Studio** with Android SDK
- **Java Development Kit (JDK) 11+**
- **Android SDK Platform-Tools**

### For iOS Development (macOS only)

- **Xcode 15+**
- **iOS SDK 13.0+**
- **CocoaPods**

## 🏗️ Project Structure

```
bizzleap-mobile/
├── 📱 Native App Files
│   ├── capacitor.config.ts      # Capacitor configuration
│   ├── package.json            # Dependencies & scripts
│   ├── android/                # Android project files
│   └── ios/                    # iOS project files
│
├── 🌐 Web App Files
│   ├── index.html              # Welcome page
│   ├── auth.html               # Authentication
│   ├── dashboard.html          # Main dashboard
│   ├── profile.html            # User profile
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
│
├── 📝 Source Code
│   ├── src/css/                # Stylesheets
│   │   ├── base.css            # Common styles
│   │   ├── mobile-platform.css # Platform-specific
│   │   ├── welcome.css         # Welcome page
│   │   ├── auth.css            # Authentication
│   │   ├── dashboard.css       # Dashboard
│   │   └── profile.css         # Profile
│   │
│   └── src/js/                 # JavaScript
│       ├── mobile-platform.js  # Platform detection
│       ├── welcome.js          # Welcome page logic
│       ├── auth.js             # Authentication logic
│       ├── dashboard.js        # Dashboard logic
│       └── profile.js          # Profile logic
│
└── 🛠️ Build Tools
    ├── build-mobile.sh         # Build script
    └── README-MOBILE.md        # This file
```

## 🔧 Development Setup

### 1. Clone and Install

```bash
git clone <your-repo>
cd bizzleap-mobile
npm install
```

### 2. Install Capacitor CLI

```bash
npm install -g @capacitor/cli
```

### 3. Initialize Mobile Platforms

```bash
# Add Android platform
cap add android

# Add iOS platform (macOS only)
cap add ios
```

## 📱 Platform-Specific Features

### Android Features

- **Material Design** components
- **Hardware back button** support
- **Android navigation bar** support
- **Status bar** customization
- **Push notifications**
- **Deep linking**
- **Hardware acceleration**

### iOS Features

- **iOS design guidelines**
- **Safe area** support (notch/Dynamic Island)
- **iOS keyboard** handling
- **Haptic feedback**
- **Status bar** styling
- **Universal links**
- **Background modes**

### Cross-Platform Features

- **Progressive Web App (PWA)**
- **Offline functionality**
- **Touch optimizations**
- **Responsive design**
- **Dark mode support**
- **Accessibility features**

## 🚀 Build Commands

### Development

```bash
# Web development
npm run serve

# Android development
npm run android:dev

# iOS development (macOS only)
npm run ios:dev
```

### Production Build

```bash
# Web build
npm run build

# Android build
npm run android:build

# iOS build (macOS only)
npm run ios:build

# All platforms
./build-mobile.sh both
```

## 📄 Page Breakdown

### 🏠 Welcome Page (`index.html`)

- **Features**: App introduction, feature showcase, call-to-action
- **Mobile**: Touch-optimized buttons, responsive grid
- **PWA**: Install prompt, offline support

### 🔐 Authentication (`auth.html`)

- **Features**: Login/signup forms, role selection, validation
- **Mobile**: Keyboard handling, form optimization
- **Security**: Input validation, secure storage

### 📊 Dashboard (`dashboard.html`)

- **Features**: Product management, statistics, quick actions
- **Mobile**: Bottom navigation, swipe gestures
- **Data**: LocalStorage integration, mock data

### 👤 Profile (`profile.html`)

- **Features**: User info, business metrics, reviews
- **Mobile**: Tab navigation, edit modes
- **Social**: Review system, sharing capabilities

## 🎨 Styling System

### CSS Architecture

- **Mobile-first** responsive design
- **Platform-specific** styles (iOS/Android)
- **Component-based** styling
- **CSS custom properties** for theming

### Design Tokens

```css
/* Primary Colors */
--primary: #16a34a;
--primary-dark: #15803d;
--accent: #22c55e;

/* Typography */
--font-family: system-ui, sans-serif;
--font-size-base: 16px;
--line-height-base: 1.5;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;

/* Borders */
--border-radius: 8px;
--border-width: 1px;
--border-color: #e5e7eb;
```

## 🏃‍♂️ Performance Optimizations

### Web Performance

- **Minified** CSS and JavaScript
- **Optimized images** and assets
- **Service Worker** caching
- **Critical CSS** inlining
- **Preload** important resources

### Mobile Performance

- **Hardware acceleration** for animations
- **Touch optimizations** for responsiveness
- **Memory management** for smooth scrolling
- **Battery optimization** for background tasks

## 🔧 Platform Integration

### Mobile APIs Used

```javascript
// Camera access
const { Camera } = await import("@capacitor/camera");

// Device info
const { Device } = await import("@capacitor/device");

// Haptic feedback
const { Haptics } = await import("@capacitor/haptics");

// Status bar
const { StatusBar } = await import("@capacitor/status-bar");

// Keyboard handling
const { Keyboard } = await import("@capacitor/keyboard");
```

### PWA Features

- **App manifest** for installation
- **Service worker** for offline support
- **Background sync** for data updates
- **Push notifications** for engagement

## 🧪 Testing

### Web Testing

```bash
# Local testing
npm run serve

# Test different screen sizes
# Chrome DevTools → Device Toggle (Ctrl+Shift+M)
```

### Android Testing

```bash
# Debug build
./build-mobile.sh android

# Install on device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep "Bizzleap"
```

### iOS Testing

```bash
# Debug build (macOS only)
./build-mobile.sh ios

# Open in Xcode
open ios/App.xcworkspace

# Run on simulator: Cmd+R
```

## 📦 Deployment

### Web Deployment

1. **Build**: `npm run build`
2. **Upload** `dist/` folder to web server
3. **Configure** HTTPS and service worker

### Android Play Store

1. **Build**: `./build-mobile.sh android`
2. **Sign**: Use release keystore
3. **Upload**: Android App Bundle to Play Console

### iOS App Store

1. **Build**: `./build-mobile.sh ios` (macOS only)
2. **Archive**: Product → Archive in Xcode
3. **Upload**: Distribute to App Store Connect

## 🔍 Debugging

### Web Debugging

```javascript
// Enable debug mode
localStorage.setItem("debug", "true");

// View logs
console.log("Debug info:", window.MobilePlatform);
```

### Android Debugging

```bash
# Chrome remote debugging
# chrome://inspect/#devices

# Native logs
adb logcat -s "Capacitor"
```

### iOS Debugging

```bash
# Safari Web Inspector
# Safari → Develop → [Device] → [App]

# Xcode Console
# Window → Devices and Simulators → View Device Logs
```

## 🛠️ Troubleshooting

### Common Issues

**Build Errors**

```bash
# Clear cache
rm -rf node_modules dist
npm install

# Reset Capacitor
cap sync --force
```

**Android Issues**

```bash
# Update SDK
sdkmanager --update

# Clean build
cd android && ./gradlew clean
```

**iOS Issues**

```bash
# Clean Xcode
Product → Clean Build Folder

# Update pods
cd ios && pod update
```

### Platform Detection Issues

```javascript
// Check platform detection
console.log("Platform:", window.MobilePlatform.platform);
console.log("Is Native:", window.MobilePlatform.isNative);
console.log("Is iOS:", window.MobilePlatform.isIOS);
console.log("Is Android:", window.MobilePlatform.isAndroid);
```

## 📚 Resources

### Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Material Design](https://material.io/design)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Tools

- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Submit** pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@bizzleap.com
- **Website**: https://bizzleap.com
- **Issues**: [GitHub Issues](https://github.com/bizzleap/mobile-app/issues)

---

**Happy coding! 🚀 Let's help farmers and small businesses thrive! 🌱**
