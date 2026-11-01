import { useEffect, useRef } from 'react';

interface UseAntiCheatOptions {
  enabled: boolean;
  onViolation: (reason: string) => void;
}

export const useAntiCheat = ({ enabled, onViolation }: UseAntiCheatOptions) => {
  const violationTriggeredRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      violationTriggeredRef.current = false;
      return;
    }

    const triggerViolation = (reason: string) => {
      if (violationTriggeredRef.current) return;
      violationTriggeredRef.current = true;
      console.warn(`[AntiCheat Violation] ${reason} at ${new Date().toISOString()}`);
      onViolation(reason);
    };

    // 1. Monitor Visibility API (Tab Switch / Minimized Window)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab Switch / Window minimized detected via Page Visibility API');
      }
    };

    // 2. Monitor Window Blur Event (Loss of browser focus / Alt+Tab / clicking outside / opening DevTools)
    const handleWindowBlur = () => {
      // Short timeout to avoid false positives during small browser UI interactions
      setTimeout(() => {
        if (!document.hasFocus()) {
          triggerViolation('Window blur detected (browser lost focus or another window activated)');
        }
      }, 100);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [enabled, onViolation]);
};
