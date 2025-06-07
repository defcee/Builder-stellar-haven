#!/bin/bash

# Bizzleap Mobile Build Script
# Builds the app for Android and iOS deployment

set -e  # Exit on any error

echo "🚀 Starting Bizzleap Mobile Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Dependencies already installed"
fi

# Create dist directory
print_status "Creating build directory..."
mkdir -p dist

# Copy all files to dist
print_status "Copying source files..."
cp -r src dist/
cp -r public dist/
cp *.html dist/
cp *.json dist/
cp sw.js dist/

# Update HTML files to include mobile platform scripts
print_status "Updating HTML files for mobile..."

# Update all HTML files to include mobile platform CSS and JS
for html_file in dist/*.html; do
    if [ -f "$html_file" ]; then
        # Add mobile platform CSS after base.css
        sed -i.bak 's|<link rel="stylesheet" href="src/css/base.css">|<link rel="stylesheet" href="src/css/base.css">\n    <link rel="stylesheet" href="src/css/mobile-platform.css">|g' "$html_file"
        
        # Add mobile platform JS before page-specific JS
        sed -i.bak 's|<script src="src/js/\([^"]*\)\.js"></script>|<script src="src/js/mobile-platform.js"></script>\n    <script src="src/js/\1.js"></script>|g' "$html_file"
        
        # Remove backup files
        rm "${html_file}.bak"
        
        print_status "Updated $(basename "$html_file")"
    fi
done

# Minify CSS files (if clean-css-cli is available)
if command -v cleancss &> /dev/null; then
    print_status "Minifying CSS files..."
    for css_file in dist/src/css/*.css; do
        if [ -f "$css_file" ]; then
            cleancss -o "$css_file" "$css_file"
            print_status "Minified $(basename "$css_file")"
        fi
    done
    print_success "CSS minification completed"
else
    print_warning "clean-css-cli not found. CSS files will not be minified."
    print_warning "Install with: npm install -g clean-css-cli"
fi

# Minify JavaScript files (if terser is available)
if command -v terser &> /dev/null; then
    print_status "Minifying JavaScript files..."
    for js_file in dist/src/js/*.js; do
        if [ -f "$js_file" ]; then
            terser "$js_file" -o "$js_file" --compress --mangle --safari10
            print_status "Minified $(basename "$js_file")"
        fi
    done
    print_success "JavaScript minification completed"
else
    print_warning "terser not found. JavaScript files will not be minified."
    print_warning "Install with: npm install -g terser"
fi

# Check if Capacitor CLI is installed
if ! command -v cap &> /dev/null; then
    print_warning "Capacitor CLI not found. Installing..."
    npm install -g @capacitor/cli
fi

# Initialize Capacitor if not already done
if [ ! -f "capacitor.config.ts" ]; then
    print_status "Initializing Capacitor..."
    cap init "Bizzleap" "com.bizzleap.mobile" --web-dir=dist
    print_success "Capacitor initialized"
fi

# Function to build for specific platform
build_platform() {
    local platform=$1
    print_status "Building for $platform..."
    
    # Add platform if not exists
    if [ ! -d "$platform" ]; then
        print_status "Adding $platform platform..."
        cap add $platform
        print_success "$platform platform added"
    fi
    
    # Sync web assets with native platform
    print_status "Syncing $platform assets..."
    cap sync $platform
    
    if [ "$platform" = "android" ]; then
        # Check if Android Studio is available
        if command -v studio &> /dev/null || [ -d "/Applications/Android Studio.app" ] || [ -d "$HOME/android-studio" ]; then
            print_status "Opening Android Studio for final build..."
            cap open android
        else
            print_warning "Android Studio not found. Please build manually:"
            print_warning "cd android && ./gradlew assembleDebug"
        fi
    elif [ "$platform" = "ios" ]; then
        # Check if Xcode is available (macOS only)
        if [[ "$OSTYPE" == "darwin"* ]] && command -v xcodebuild &> /dev/null; then
            print_status "Opening Xcode for final build..."
            cap open ios
        else
            print_warning "Xcode not found or not on macOS. iOS build requires Xcode on macOS."
        fi
    fi
    
    print_success "$platform build preparation completed"
}

# Build process
case "$1" in
    "android")
        build_platform "android"
        ;;
    "ios")
        if [[ "$OSTYPE" != "darwin"* ]]; then
            print_error "iOS builds require macOS"
            exit 1
        fi
        build_platform "ios"
        ;;
    "both")
        build_platform "android"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            build_platform "ios"
        else
            print_warning "Skipping iOS build (macOS required)"
        fi
        ;;
    "web")
        print_status "Web build completed. Files are in dist/ directory"
        print_status "To serve locally: npm run serve"
        ;;
    *)
        print_status "Usage: $0 [android|ios|both|web]"
        print_status "Building for web by default..."
        print_success "Web build completed. Files are in dist/ directory"
        print_status "To serve locally: npm run serve"
        print_status ""
        print_status "To build for mobile platforms:"
        print_status "  ./build-mobile.sh android  - Build for Android"
        print_status "  ./build-mobile.sh ios      - Build for iOS (macOS only)"
        print_status "  ./build-mobile.sh both     - Build for both platforms"
        ;;
esac

# Final instructions
echo ""
print_success "🎉 Build process completed!"
echo ""
print_status "Next steps:"

if [ "$1" = "android" ] || [ "$1" = "both" ]; then
    echo "📱 For Android:"
    echo "   1. Open Android Studio"
    echo "   2. Open the 'android' folder"
    echo "   3. Build APK: Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "   4. Install: adb install android/app/build/outputs/apk/debug/app-debug.apk"
    echo ""
fi

if [ "$1" = "ios" ] || ([ "$1" = "both" ] && [[ "$OSTYPE" == "darwin"* ]]); then
    echo "🍎 For iOS:"
    echo "   1. Open Xcode"
    echo "   2. Open the 'ios/App.xcworkspace' file"
    echo "   3. Select your target device/simulator"
    echo "   4. Build and run: Cmd+R"
    echo ""
fi

echo "🌐 For Web/PWA:"
echo "   1. Deploy the 'dist' folder to your web server"
echo "   2. Or test locally: npm run serve"
echo ""

print_status "Build artifacts:"
print_status "  📁 dist/          - Web build files"
if [ "$1" = "android" ] || [ "$1" = "both" ]; then
    print_status "  📁 android/       - Android project files"
fi
if [ "$1" = "ios" ] || ([ "$1" = "both" ] && [[ "$OSTYPE" == "darwin"* ]]); then
    print_status "  📁 ios/           - iOS project files"
fi

echo ""
print_success "Happy coding! 🚀"
