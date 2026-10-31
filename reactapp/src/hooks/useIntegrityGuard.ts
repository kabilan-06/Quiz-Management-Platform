import { useState, useEffect, useCallback, useRef } from 'react';

export interface IntegrityViolation {
  id: string;
  type: 'WINDOW_BLUR' | 'TAB_SWITCH' | 'MOUSE_LEAVE' | 'PASTE_INJECTION' | 'FULLSCREEN_EXIT' | 'DEVTOOLS_SHORTCUT';
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  penalty: number;
  message: string;
}

export interface IntegrityGuardOptions {
  enableFullscreenLock?: boolean;
  maxViolationsAllowed?: number;
  penaltyWindowBlur?: number;
  penaltyTabSwitch?: number;
  penaltyPaste?: number;
  onViolation?: (violation: IntegrityViolation, currentTrustScore: number) => void;
  onDisqualification?: (violations: IntegrityViolation[]) => void;
}

export interface IntegrityGuardState {
  trustScore: number; // 0 - 100
  violationCount: number;
  violations: IntegrityViolation[];
  isWindowFocused: boolean;
  isTabVisible: boolean;
  isFullscreen: boolean;
  requestFullscreen: () => Promise<void>;
  resetGuards: () => void;
}

export const useIntegrityGuard = (options: IntegrityGuardOptions = {}): IntegrityGuardState => {
  const {
    enableFullscreenLock = false,
    maxViolationsAllowed = 5,
    penaltyWindowBlur = 5,
    penaltyTabSwitch = 10,
    penaltyPaste = 8,
    onViolation,
    onDisqualification
  } = options;

  const [trustScore, setTrustScore] = useState<number>(100);
  const [violations, setViolations] = useState<IntegrityViolation[]>([]);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(Boolean(document.fullscreenElement));

  const hasDisqualifiedRef = useRef<boolean>(false);

  const recordViolation = useCallback((
    type: IntegrityViolation['type'],
    severity: IntegrityViolation['severity'],
    penalty: number,
    message: string
  ) => {
    const violation: IntegrityViolation = {
      id: `violation_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: new Date().toISOString(),
      severity,
      penalty,
      message
    };

    setViolations(prev => {
      const updated = [...prev, violation];
      if (updated.length >= maxViolationsAllowed && !hasDisqualifiedRef.current) {
        hasDisqualifiedRef.current = true;
        onDisqualification?.(updated);
      }
      return updated;
    });

    setTrustScore(prev => {
      const newScore = Math.max(0, prev - penalty);
      onViolation?.(violation, newScore);
      return newScore;
    });
  }, [maxViolationsAllowed, onDisqualification, onViolation]);

  const requestFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn('Fullscreen request rejected or not supported by browser', err);
    }
  }, []);

  const resetGuards = useCallback(() => {
    setTrustScore(100);
    setViolations([]);
    hasDisqualifiedRef.current = false;
  }, []);

  useEffect(() => {
    // 1. Window Blur / Focus
    const handleBlur = () => {
      setIsWindowFocused(false);
      recordViolation(
        'WINDOW_BLUR',
        'MEDIUM',
        penaltyWindowBlur,
        'Window lost focus. Candidate switched away from assessment.'
      );
    };

    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    // 2. Tab Visibility (Document hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabVisible(false);
        recordViolation(
          'TAB_SWITCH',
          'HIGH',
          penaltyTabSwitch,
          'Browser tab switch detected. Candidate navigated to another browser tab.'
        );
      } else {
        setIsTabVisible(true);
      }
    };

    // 3. Mouse leaving window bounds
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        // Soft warning for cursor leaving exam window
        recordViolation(
          'MOUSE_LEAVE',
          'LOW',
          1,
          'Cursor moved outside assessment viewport boundary.'
        );
      }
    };

    // 4. Paste Injections (detect bulk paste)
    const handlePaste = (e: ClipboardEvent) => {
      const pastedData = e.clipboardData?.getData('text') || '';
      if (pastedData.length > 50) {
        recordViolation(
          'PASTE_INJECTION',
          'HIGH',
          penaltyPaste,
          `Unauthorized external text paste detected (${pastedData.length} characters).`
        );
      }
    };

    // 5. Fullscreen Change
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (enableFullscreenLock && !active) {
        recordViolation(
          'FULLSCREEN_EXIT',
          'HIGH',
          15,
          'Candidate exited mandated fullscreen mode.'
        );
      }
    };

    // 6. Block DevTools Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        recordViolation(
          'DEVTOOLS_SHORTCUT',
          'HIGH',
          20,
          `Attempted DevTools inspection shortcut (${e.key}). Action blocked.`
        );
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('paste', handlePaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('paste', handlePaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enableFullscreenLock,
    penaltyWindowBlur,
    penaltyTabSwitch,
    penaltyPaste,
    recordViolation
  ]);

  return {
    trustScore,
    violationCount: violations.length,
    violations,
    isWindowFocused,
    isTabVisible,
    isFullscreen,
    requestFullscreen,
    resetGuards
  };
};
