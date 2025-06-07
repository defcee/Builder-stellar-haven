import { useState, useEffect } from "react";

interface MobilePlatformHook {
  platform: "ios" | "android" | "web";
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isNative: boolean;
  isStandalone: boolean;
  hasNotch: boolean;
  triggerHaptic: (type?: "light" | "medium" | "heavy") => Promise<void>;
  showToast: (message: string, duration?: "short" | "long") => Promise<void>;
  shareContent: (content: {
    title?: string;
    text?: string;
    url?: string;
  }) => Promise<boolean>;
  openUrl: (url: string) => Promise<void>;
}

export const useMobilePlatform = (): MobilePlatformHook => {
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;

      if (/android/i.test(userAgent)) {
        setPlatform("android");
      } else if (
        /iPad|iPhone|iPod/.test(userAgent) &&
        !(window as any).MSStream
      ) {
        setPlatform("ios");
      } else {
        setPlatform("web");
      }

      // Check if running in Capacitor
      setIsNative(!!(window as any).Capacitor);
    };

    detectPlatform();

    // Add platform classes to body
    document.body.classList.add(`platform-${platform}`);

    if (isNative) {
      document.body.classList.add("capacitor-app");
    }

    // Check for standalone mode (PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      document.body.classList.add("standalone-app");
    }

    return () => {
      document.body.classList.remove(
        `platform-${platform}`,
        "capacitor-app",
        "standalone-app",
      );
    };
  }, [platform, isNative]);

  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const isMobile = isIOS || isAndroid;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone ||
    document.referrer.includes("android-app://");

  const hasNotch =
    isIOS &&
    (window.screen.height / window.screen.width > 2.0 ||
      CSS.supports("padding-top: env(safe-area-inset-top)"));

  const triggerHaptic = async (
    type: "light" | "medium" | "heavy" = "light",
  ): Promise<void> => {
    if (isNative && (window as any).Capacitor) {
      try {
        const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
        const impacts = {
          light: ImpactStyle.Light,
          medium: ImpactStyle.Medium,
          heavy: ImpactStyle.Heavy,
        };
        await Haptics.impact({ style: impacts[type] });
      } catch (error) {
        console.warn("Haptic feedback failed:", error);
      }
    } else if ("vibrate" in navigator) {
      // Fallback for web
      const patterns = { light: 50, medium: 100, heavy: 200 };
      navigator.vibrate(patterns[type]);
    }
  };

  const showToast = async (
    message: string,
    duration: "short" | "long" = "short",
  ): Promise<void> => {
    if (isNative && (window as any).Capacitor) {
      try {
        const { Toast } = await import("@capacitor/toast");
        await Toast.show({
          text: message,
          duration: duration,
          position: "bottom",
        });
        return;
      } catch (error) {
        console.warn("Native toast failed:", error);
      }
    }

    // Fallback web toast
    const toast = document.createElement("div");
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
      max-width: 90%;
      text-align: center;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => (toast.style.opacity = "1"), 10);
    setTimeout(
      () => {
        toast.style.opacity = "0";
        setTimeout(() => document.body.removeChild(toast), 300);
      },
      duration === "long" ? 5000 : 3000,
    );
  };

  const shareContent = async (content: {
    title?: string;
    text?: string;
    url?: string;
  }): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share(content);
        return true;
      } catch (error) {
        console.warn("Web Share API failed:", error);
      }
    }

    // Fallback: copy to clipboard
    if (content.url) {
      try {
        await navigator.clipboard.writeText(content.url);
        await showToast("Link copied to clipboard");
        return true;
      } catch (error) {
        console.warn("Clipboard API failed:", error);
      }
    }

    return false;
  };

  const openUrl = async (url: string): Promise<void> => {
    if (isNative && (window as any).Capacitor) {
      try {
        const { App } = await import("@capacitor/app");
        await App.openUrl({ url });
        return;
      } catch (error) {
        console.warn("Native URL opening failed:", error);
      }
    }

    window.open(url, "_blank");
  };

  return {
    platform,
    isIOS,
    isAndroid,
    isMobile,
    isNative,
    isStandalone,
    hasNotch,
    triggerHaptic,
    showToast,
    shareContent,
    openUrl,
  };
};
