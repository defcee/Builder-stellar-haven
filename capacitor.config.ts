import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bizzleap.mobile",
  appName: "Bizzleap",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#16a34a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    StatusBar: {
      style: "LIGHT_CONTENT",
      backgroundColor: "#16a34a",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#16a34a",
      sound: "beep.wav",
    },
    Camera: {
      permissions: {
        camera: "This app needs access to camera to take photos of products",
        photos:
          "This app needs access to photo library to select product images",
      },
    },
    Geolocation: {
      permissions: {
        location: "This app needs access to location to show nearby businesses",
      },
    },
    Haptics: {},
    App: {
      launchUrl: "bizzleap://",
      iosCustomApplicationProtocol: "bizzleap",
    },
    Device: {},
    Network: {},
    Share: {},
    Toast: {},
  },
  ios: {
    scheme: "Bizzleap",
    backgroundColor: "#16a34a",
    allowsLinkPreview: false,
    scrollEnabled: true,
    swipeGesture: true,
    preferredContentMode: "mobile",
    presentationStyle: "fullscreen",
  },
  android: {
    backgroundColor: "#16a34a",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    initialFocus: true,
    appendUserAgent: "BizzleapMobile",
    loggingBehavior: "none",
    themeColor: "#16a34a",
    navigationColor: "#ffffff",
    hideLogs: true,
  },
};

export default config;
